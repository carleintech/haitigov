import { loadEnvFile } from "node:process";

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DatabaseService } from "../../apps/api/src/database/database.module.js";
import { PrismaInstitutionRepository } from "../../apps/api/src/institutions/institutions.repository.js";
import { InstitutionsService } from "../../apps/api/src/institutions/institutions.service.js";
import {
  InstitutionRelationshipType,
  RegistrySubjectType,
  VerificationOutcome,
} from "../../packages/database/src/index.ts";

const parentId = "HT-TEST-PARENT";
const childId = "HT-TEST-CHILD";
const sourceName = "Development fixture: institution repository test";

describe("institution repository integration", () => {
  let database: DatabaseService;
  let repository: PrismaInstitutionRepository;
  let service: InstitutionsService;

  async function cleanFixtures(): Promise<void> {
    await database.client.verificationEvent.deleteMany({
      where: {
        subjectId: { in: [parentId, childId] },
        subjectType: RegistrySubjectType.INSTITUTION,
      },
    });
    await database.client.sourceRecord.deleteMany({
      where: {
        subjectId: { in: [parentId, childId] },
        subjectType: RegistrySubjectType.INSTITUTION,
      },
    });
    await database.client.institutionRelationship.deleteMany({
      where: {
        OR: [
          { sourceInstitutionId: { in: [parentId, childId] } },
          { targetInstitutionId: { in: [parentId, childId] } },
        ],
      },
    });
    await database.client.institutionAlias.deleteMany({
      where: { institutionId: { in: [parentId, childId] } },
    });
    await database.client.institution.deleteMany({ where: { id: { in: [parentId, childId] } } });
    await database.client.source.deleteMany({ where: { name: sourceName } });
  }

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      loadEnvFile(".env");
    }
    database = new DatabaseService();
    repository = new PrismaInstitutionRepository(database);
    service = new InstitutionsService(repository);
    await cleanFixtures();

    await database.client.institution.createMany({
      data: [
        {
          branch: "EXECUTIVE",
          id: parentId,
          institutionType: "OTHER",
          jurisdiction: "Development fixture",
          officialName: "Development fixture parent institution",
          status: "UNKNOWN",
          verificationStatus: "PENDING_REVIEW",
        },
        {
          acronym: "TST",
          branch: "EXECUTIVE",
          id: childId,
          institutionType: "OTHER",
          jurisdiction: "Development fixture",
          notes: "Internal development fixture note",
          officialName: "Development fixture child institution",
          proposedDataDomain: "internal-test-domain",
          status: "UNKNOWN",
          verificationStatus: "PENDING_REVIEW",
        },
      ],
    });
    await database.client.institutionAlias.create({
      data: {
        aliasType: "SHORT_NAME",
        institutionId: childId,
        name: "Revenue registry development fixture",
      },
    });
    await database.client.institutionRelationship.create({
      data: {
        relationshipType: InstitutionRelationshipType.PARENT_OF,
        sourceInstitutionId: parentId,
        targetInstitutionId: childId,
      },
    });
    const source = await database.client.source.create({
      data: {
        name: sourceName,
        sourceInstitution: "Development fixture",
        sourceUrl: "https://example.invalid/haitigov/institution-test",
      },
    });
    const sourceRecord = await database.client.sourceRecord.create({
      data: {
        retrievedAt: new Date("2026-09-27T00:00:00.000Z"),
        sourceId: source.id,
        subjectId: childId,
        subjectType: RegistrySubjectType.INSTITUTION,
      },
    });
    await database.client.verificationEvent.create({
      data: {
        outcome: VerificationOutcome.UNRESOLVED,
        sourceRecordId: sourceRecord.id,
        subjectId: childId,
        subjectType: RegistrySubjectType.INSTITUTION,
        verifiedAt: new Date("2026-09-27T00:00:00.000Z"),
      },
    });
  });

  afterAll(async () => {
    await cleanFixtures();
    await database.onModuleDestroy();
  });

  it("searches official names, acronyms, and aliases and filters by parent", async () => {
    const result = await repository.findMany({
      limit: 50,
      parent: parentId,
      q: "Revenue registry",
    });

    expect(result.records.map((record) => record.id)).toEqual([childId]);
  });

  it("returns aliases, relationships, provenance, and verification history", async () => {
    const result = await repository.findById(childId);

    expect(result?.institution.aliases.map((alias) => alias.name)).toContain(
      "Revenue registry development fixture",
    );
    expect(result?.institution.incomingRelationships[0]?.sourceInstitutionId).toBe(parentId);
    expect(result?.sources[0]?.source.name).toBe(sourceName);
    expect(result?.verificationEvents[0]?.outcome).toBe(VerificationOutcome.UNRESOLVED);
  });

  it("maps an explicit public DTO without internal registry fields", async () => {
    const result = await service.getById(childId);
    const serialized = JSON.stringify(result);

    expect(result.institutionId).toBe(childId);
    expect(serialized).not.toContain("Internal development fixture note");
    expect(serialized).not.toContain("internal-test-domain");
  });

  it("returns source-backed MICT offices through explicit public DTOs", async () => {
    const result = await service.getById("HT-MIN-003");
    const serialized = JSON.stringify(result);

    expect(result.offices).toHaveLength(52);
    expect(result.offices.filter((office) => office.officeType === "DELEGATION")).toHaveLength(10);
    expect(result.offices.filter((office) => office.officeType === "VICE_DELEGATION")).toHaveLength(
      42,
    );
    expect(result.offices[0]).toMatchObject({
      arrondissement: null,
      coverage: "DEPARTMENT",
      department: { departmentId: "HT-DEP-01", name: "Ouest" },
      officeId: "HT-MICT-DEL-01",
    });
    expect(serialized).not.toContain("payloadHash");
    expect(serialized).not.toContain("sourceRow");
  });

  it("enforces duplicate canonical IDs", async () => {
    await expect(
      database.client.institution.create({
        data: {
          branch: "EXECUTIVE",
          id: childId,
          institutionType: "OTHER",
          jurisdiction: "Development fixture",
          officialName: "Duplicate development fixture",
        },
      }),
    ).rejects.toMatchObject({ code: "P2002" });
  });

  it("enforces the database self-relationship guard", async () => {
    await expect(
      database.client.institutionRelationship.create({
        data: {
          relationshipType: InstitutionRelationshipType.RELATED_TO,
          sourceInstitutionId: childId,
          targetInstitutionId: childId,
        },
      }),
    ).rejects.toBeDefined();
  });
});
