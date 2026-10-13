import { loadEnvFile } from "node:process";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  createDatabaseClient,
  InstitutionRelationshipType,
  type PrismaClient,
  RegistrySubjectType,
  VerificationStatus,
} from "../../packages/database/src/index.ts";

describe("Phase 3 registry seed", () => {
  let database: PrismaClient;

  beforeAll(() => {
    if (!process.env.DATABASE_URL) {
      loadEnvFile(".env");
    }
    database = createDatabaseClient();
  });

  afterAll(async () => {
    await database.$disconnect();
  });

  it("imports the reviewed institution master without inventing state-institution rows", async () => {
    const [total, stateExpansionRows, ministries, publicEnterprises] = await Promise.all([
      database.institution.count(),
      database.institution.count({ where: { id: { startsWith: "HT-STATE-" } } }),
      database.institution.count({ where: { institutionType: "MINISTRY" } }),
      database.institution.count({ where: { institutionType: "PUBLIC_ENTERPRISE" } }),
    ]);

    expect({ ministries, publicEnterprises, stateExpansionRows, total }).toEqual({
      ministries: 19,
      publicEnterprises: 6,
      stateExpansionRows: 0,
      total: 74,
    });
  });

  it("preserves the source verification split and parent relationships", async () => {
    const [current, legacy, parents] = await Promise.all([
      database.institution.count({
        where: { verificationStatus: VerificationStatus.VERIFIED_CURRENT },
      }),
      database.institution.count({
        where: { verificationStatus: VerificationStatus.VERIFIED_LEGACY },
      }),
      database.institutionRelationship.count({
        where: {
          id: { startsWith: "seed:v1.1:" },
          relationshipType: InstitutionRelationshipType.PARENT_OF,
        },
      }),
    ]);

    expect({ current, legacy, parents }).toEqual({ current: 11, legacy: 63, parents: 54 });
  });

  it("imports the complete named territorial hierarchy but no unnamed communal sections", async () => {
    const [departments, arrondissements, communes, communalSections, aggregates] =
      await Promise.all([
        database.department.count(),
        database.arrondissement.count(),
        database.commune.count(),
        database.communalSection.count(),
        database.department.aggregate({
          _sum: {
            arrondissementCount: true,
            communalSectionCount: true,
            communeCount: true,
            quartierCount: true,
          },
        }),
      ]);

    expect({ arrondissements, communalSections, communes, departments }).toEqual({
      arrondissements: 42,
      communalSections: 0,
      communes: 149,
      departments: 10,
    });
    expect(aggregates._sum).toEqual({
      arrondissementCount: 42,
      communalSectionCount: 574,
      communeCount: 149,
      quartierCount: 59,
    });
  });

  it("attaches deterministic provenance and verification events to every imported row", async () => {
    const [sourceRecords, verificationEvents, subjectCounts] = await Promise.all([
      database.sourceRecord.count({ where: { id: { startsWith: "seed:v1.1:" } } }),
      database.verificationEvent.count({ where: { id: { startsWith: "seed:v1.1:" } } }),
      database.sourceRecord.groupBy({
        _count: { _all: true },
        by: ["subjectType"],
        where: { id: { startsWith: "seed:v1.1:" } },
      }),
    ]);
    const counts = Object.fromEntries(
      subjectCounts.map((record) => [record.subjectType, record._count._all]),
    );

    expect(sourceRecords).toBe(327);
    expect(verificationEvents).toBe(327);
    expect(counts).toMatchObject({
      [RegistrySubjectType.ARRONDISSEMENT]: 42,
      [RegistrySubjectType.COMMUNE]: 149,
      [RegistrySubjectType.DEPARTMENT]: 10,
      [RegistrySubjectType.INSTITUTION]: 74,
      [RegistrySubjectType.INSTITUTION_OFFICE]: 52,
    });
  });

  it("keeps territory verification normalization conservative", async () => {
    const [departmentsPending, arrondissementsPending, communesPartial] = await Promise.all([
      database.department.count({
        where: { verificationStatus: VerificationStatus.PENDING_REVIEW },
      }),
      database.arrondissement.count({
        where: { verificationStatus: VerificationStatus.PENDING_REVIEW },
      }),
      database.commune.count({
        where: { verificationStatus: VerificationStatus.PARTIALLY_VERIFIED },
      }),
    ]);

    expect({ arrondissementsPending, communesPartial, departmentsPending }).toEqual({
      arrondissementsPending: 42,
      communesPartial: 149,
      departmentsPending: 10,
    });
  });

  it("imports MICT territorial offices with enforced territorial coverage", async () => {
    const [
      total,
      delegations,
      viceDelegations,
      invalidDepartmentLinks,
      invalidArrondissementLinks,
    ] = await Promise.all([
      database.institutionOffice.count(),
      database.institutionOffice.count({
        where: { coverage: "DEPARTMENT", officeType: "DELEGATION" },
      }),
      database.institutionOffice.count({
        where: { coverage: "ARRONDISSEMENT", officeType: "VICE_DELEGATION" },
      }),
      database.institutionOffice.count({
        where: { coverage: "DEPARTMENT", NOT: { arrondissementId: null } },
      }),
      database.institutionOffice.count({
        where: { coverage: "ARRONDISSEMENT", arrondissementId: null },
      }),
    ]);

    expect({
      delegations,
      invalidArrondissementLinks,
      invalidDepartmentLinks,
      total,
      viceDelegations,
    }).toEqual({
      delegations: 10,
      invalidArrondissementLinks: 0,
      invalidDepartmentLinks: 0,
      total: 52,
      viceDelegations: 42,
    });
    await expect(
      database.institutionOffice.count({ where: { institutionId: { not: "HT-MIN-003" } } }),
    ).resolves.toBe(0);
  });

  it("rejects an institution office whose type and territorial coverage disagree", async () => {
    await expect(
      database.institutionOffice.create({
        data: {
          arrondissementId: "HT-ARR-001",
          coverage: "DEPARTMENT",
          departmentId: "HT-DEP-01",
          id: "HT-TEST-INVALID-OFFICE",
          institutionId: "HT-MIN-003",
          locality: "Development fixture",
          officeType: "DELEGATION",
        },
      }),
    ).rejects.toThrow();
  });
});
