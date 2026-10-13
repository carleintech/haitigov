import { createHash } from "node:crypto";
import officeManifest from "../../../data/institutions/offices-v1.1.json" with { type: "json" };
import institutionManifest from "../../../data/institutions/registry-v1.1.json" with {
  type: "json",
};
import arrondissementManifest from "../../../data/territories/arrondissements-v1.1.json" with {
  type: "json",
};
import communeManifest from "../../../data/territories/communes-v1.1.json" with { type: "json" };
import departmentManifest from "../../../data/territories/departments-v1.1.json" with {
  type: "json",
};

import {
  GovernmentBranch,
  InstitutionOfficeCoverage,
  InstitutionOfficeType,
  InstitutionRelationshipType,
  InstitutionType,
  type PrismaClient,
  RegistrySubjectType,
  VerificationOutcome,
  VerificationStatus,
} from "../generated/prisma/client.js";

const REGISTRY_VERSION = "1.1";
const SOURCE_VERIFIED_AT = new Date("2026-09-26T00:00:00.000Z");

type SourceUrl =
  | "https://ihsi.gouv.ht/public/storage/document-views/March2025/Oan4m17p5LEKtsGEnHgt.pdf"
  | "https://www.mict.gouv.ht/delegation-et-vice-delegation/"
  | "https://mef.gouv.ht/presentation"
  | "https://servicespublics.gouv.ht/site/ministeres"
  | "https://servicespublics.gouv.ht/site/organismes";

interface SourceDefinition {
  readonly id: string;
  readonly name: string;
  readonly sourceInstitution: string;
}

const sourceDefinitions = new Map<SourceUrl, SourceDefinition>([
  [
    "https://www.mict.gouv.ht/delegation-et-vice-delegation/",
    {
      id: "seed-source-mict-territorial-offices",
      name: "MICT delegations and vice-delegations directory",
      sourceInstitution: "Ministère de l'Intérieur et des Collectivités Territoriales",
    },
  ],
  [
    "https://ihsi.gouv.ht/public/storage/document-views/March2025/Oan4m17p5LEKtsGEnHgt.pdf",
    {
      id: "seed-source-ihsi-territorial-2024",
      name: "IHSI territorial baseline (2024)",
      sourceInstitution: "Institut Haïtien de Statistique et d'Informatique",
    },
  ],
  [
    "https://mef.gouv.ht/presentation",
    {
      id: "seed-source-mef-presentation",
      name: "MEF official presentation",
      sourceInstitution: "Ministère de l'Économie et des Finances",
    },
  ],
  [
    "https://servicespublics.gouv.ht/site/ministeres",
    {
      id: "seed-source-services-publics-ministries",
      name: "Services Publics ministry directory",
      sourceInstitution: "OMRH/CRA Services Publics",
    },
  ],
  [
    "https://servicespublics.gouv.ht/site/organismes",
    {
      id: "seed-source-services-publics-organisms",
      name: "Services Publics public-organism directory",
      sourceInstitution: "OMRH/CRA Services Publics",
    },
  ],
]);

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Registry v${REGISTRY_VERSION} validation failed: ${message}`);
  }
}

function assertUnique(values: readonly string[], label: string): void {
  assert(new Set(values).size === values.length, `${label} contains duplicate identifiers.`);
}

function isCanonicalIdentifier(value: string): boolean {
  const segments = value.split("-");
  if (segments.length < 2 || segments[0] !== "HT") {
    return false;
  }

  return segments.slice(1).every((segment) => {
    if (segment.length === 0) {
      return false;
    }
    for (let index = 0; index < segment.length; index += 1) {
      const code = segment.charCodeAt(index);
      if (!((code >= 48 && code <= 57) || (code >= 65 && code <= 90))) {
        return false;
      }
    }
    return true;
  });
}

function requireSourceUrl(value: string): SourceUrl {
  assert(sourceDefinitions.has(value as SourceUrl), `unsupported source URL: ${value}`);
  return value as SourceUrl;
}

function requireEnumValue<T extends Record<string, string>>(
  enumValues: T,
  value: string,
  label: string,
): T[keyof T] {
  assert(Object.values(enumValues).includes(value), `${label} has unsupported value ${value}.`);
  return value as T[keyof T];
}

function payloadHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function verificationOutcome(status: VerificationStatus): VerificationOutcome {
  if (
    status === VerificationStatus.VERIFIED_CURRENT ||
    status === VerificationStatus.VERIFIED_LEGACY
  ) {
    return VerificationOutcome.CONFIRMED;
  }
  if (status === VerificationStatus.PARTIALLY_VERIFIED) {
    return VerificationOutcome.PARTIALLY_CONFIRMED;
  }
  return VerificationOutcome.UNRESOLVED;
}

function normalizedTerritoryStatus(sourceStatus: string | null | undefined): VerificationStatus {
  if (sourceStatus === "VERIFIED_2024_IHSI") {
    return VerificationStatus.PARTIALLY_VERIFIED;
  }
  return VerificationStatus.PENDING_REVIEW;
}

function normalizedOfficeType(sourceType: string): InstitutionOfficeType {
  if (sourceType === "DÉLÉGATION") {
    return InstitutionOfficeType.DELEGATION;
  }
  if (sourceType === "VICE-DÉLÉGATION") {
    return InstitutionOfficeType.VICE_DELEGATION;
  }
  throw new Error(
    `Registry v${REGISTRY_VERSION} validation failed: unsupported office type ${sourceType}.`,
  );
}

function normalizedOfficeCoverage(sourceCoverage: string): InstitutionOfficeCoverage {
  if (sourceCoverage === "Department") {
    return InstitutionOfficeCoverage.DEPARTMENT;
  }
  if (sourceCoverage === "Arrondissement") {
    return InstitutionOfficeCoverage.ARRONDISSEMENT;
  }
  throw new Error(
    `Registry v${REGISTRY_VERSION} validation failed: unsupported office coverage ${sourceCoverage}.`,
  );
}

function validateManifests(): void {
  const manifests = [
    institutionManifest,
    officeManifest,
    departmentManifest,
    arrondissementManifest,
    communeManifest,
  ];
  for (const manifest of manifests) {
    assert(manifest.registryVersion === REGISTRY_VERSION, "manifest version mismatch.");
    assert(
      manifest.sourceWorkbook === "HaitiGov_National_Institution_Registry_v1_1.xlsx",
      "unexpected source workbook.",
    );
    assert(
      manifest.sourceVerifiedAt === SOURCE_VERIFIED_AT.toISOString(),
      "unexpected source verification date.",
    );
  }

  assert(institutionManifest.records.length === 74, "expected 74 institution rows.");
  assert(officeManifest.records.length === 52, "expected 52 territorial-office rows.");
  assert(departmentManifest.records.length === 10, "expected 10 department rows.");
  assert(arrondissementManifest.records.length === 42, "expected 42 arrondissement rows.");
  assert(communeManifest.records.length === 149, "expected 149 commune rows.");

  assertUnique(
    institutionManifest.records.map((record) => record.institutionId),
    "institution manifest",
  );
  assertUnique(
    officeManifest.records.map((record) => record.officeId),
    "institution-office manifest",
  );
  assertUnique(
    departmentManifest.records.map((record) => record.departmentId),
    "department manifest",
  );
  assertUnique(
    arrondissementManifest.records.map((record) => record.arrondissementId),
    "arrondissement manifest",
  );
  assertUnique(
    communeManifest.records.map((record) => record.communeId),
    "commune manifest",
  );

  const institutionsByAcronym = new Map(
    institutionManifest.records.map((record) => [record.acronym, record.institutionId]),
  );
  assert(
    institutionsByAcronym.size === institutionManifest.records.length,
    "institution acronyms must be unique for parent resolution.",
  );
  for (const record of institutionManifest.records) {
    assert(
      isCanonicalIdentifier(record.institutionId),
      `invalid institution ID ${record.institutionId}.`,
    );
    requireEnumValue(InstitutionType, record.institutionType, `${record.institutionId} type`);
    requireEnumValue(GovernmentBranch, record.branch, `${record.institutionId} branch`);
    requireEnumValue(
      VerificationStatus,
      record.verificationStatus,
      `${record.institutionId} verification status`,
    );
    requireSourceUrl(record.sourceUrl);
    if (record.parentAcronym !== null) {
      assert(
        institutionsByAcronym.has(record.parentAcronym),
        `${record.institutionId} has unresolved parent acronym ${record.parentAcronym}.`,
      );
    }
  }

  const departmentIds = new Set(departmentManifest.records.map((record) => record.departmentId));
  const departmentNames = new Set(departmentManifest.records.map((record) => record.name));
  const arrondissementIds = new Set(
    arrondissementManifest.records.map((record) => record.arrondissementId),
  );
  const arrondissementKeys = new Set(
    arrondissementManifest.records.map((record) => `${record.departmentName}\u0000${record.name}`),
  );
  for (const record of officeManifest.records) {
    assert(isCanonicalIdentifier(record.officeId), `invalid office ID ${record.officeId}.`);
    assert(record.institutionAcronym === "MICT", `${record.officeId} is not attributed to MICT.`);
    assert(
      record.sourceVerificationStatus === "VERIFIED_CURRENT",
      `${record.officeId} has an unexpected source verification label.`,
    );
    const officeType = normalizedOfficeType(record.sourceOfficeType);
    const coverage = normalizedOfficeCoverage(record.sourceCoverage);
    assert(
      departmentNames.has(record.departmentName),
      `${record.officeId} has an unknown department.`,
    );
    if (officeType === InstitutionOfficeType.DELEGATION) {
      assert(
        coverage === InstitutionOfficeCoverage.DEPARTMENT,
        `${record.officeId} has mismatched coverage.`,
      );
    } else {
      assert(
        coverage === InstitutionOfficeCoverage.ARRONDISSEMENT,
        `${record.officeId} has mismatched coverage.`,
      );
      assert(
        arrondissementKeys.has(`${record.departmentName}\u0000${record.locality}`),
        `${record.officeId} has an unknown arrondissement locality.`,
      );
    }
    requireSourceUrl(record.sourceUrl);
  }
  for (const record of departmentManifest.records) {
    assert(
      isCanonicalIdentifier(record.departmentId),
      `invalid department ID ${record.departmentId}.`,
    );
    requireSourceUrl(record.sourceUrl);
  }
  for (const record of arrondissementManifest.records) {
    assert(
      departmentIds.has(record.departmentId),
      `${record.arrondissementId} has an unknown department.`,
    );
    requireSourceUrl(record.sourceUrl);
  }
  for (const record of communeManifest.records) {
    assert(
      departmentIds.has(record.departmentId),
      `${record.communeId} has an unknown department.`,
    );
    assert(
      arrondissementIds.has(record.arrondissementId),
      `${record.communeId} has an unknown arrondissement.`,
    );
    assert(
      record.sourceVerificationStatus === "VERIFIED_2024_IHSI",
      `${record.communeId} has an unexpected source verification label.`,
    );
    requireSourceUrl(record.sourceUrl);
  }

  const totals = departmentManifest.records.reduce(
    (result, record) => ({
      arrondissements: result.arrondissements + record.arrondissementCount,
      communalSections: result.communalSections + record.communalSectionCount,
      communes: result.communes + record.communeCount,
      quartiers: result.quartiers + record.quartierCount,
    }),
    { arrondissements: 0, communalSections: 0, communes: 0, quartiers: 0 },
  );
  assert(totals.arrondissements === 42, "department arrondissement total must be 42.");
  assert(totals.communes === 149, "department commune total must be 149.");
  assert(totals.communalSections === 574, "communal-section aggregate must be 574.");
  assert(totals.quartiers === 59, "quartier aggregate must be 59.");
  assert(
    officeManifest.records.filter((record) => record.sourceCoverage === "Department").length === 10,
    "expected 10 departmental delegations.",
  );
  assert(
    officeManifest.records.filter((record) => record.sourceCoverage === "Arrondissement").length ===
      42,
    "expected 42 arrondissement vice-delegations.",
  );
}

async function upsertSource(prisma: PrismaClient, sourceUrl: SourceUrl): Promise<string> {
  const definition = sourceDefinitions.get(sourceUrl);
  assert(definition !== undefined, `missing source definition for ${sourceUrl}.`);
  await prisma.source.upsert({
    where: { id: definition.id },
    create: { ...definition, sourceUrl },
    update: {
      name: definition.name,
      sourceInstitution: definition.sourceInstitution,
      sourceUrl,
    },
  });
  return definition.id;
}

interface ProvenanceInput {
  readonly record: unknown;
  readonly sourceRow: number;
  readonly sourceSheet: string;
  readonly sourceStatus: string | null;
  readonly sourceUrl: SourceUrl;
  readonly subjectId: string;
  readonly subjectType: RegistrySubjectType;
  readonly verificationStatus: VerificationStatus;
}

async function upsertProvenance(prisma: PrismaClient, input: ProvenanceInput): Promise<void> {
  const sourceId = await upsertSource(prisma, input.sourceUrl);
  const subjectKey = `${input.subjectType.toLowerCase()}:${input.subjectId}`;
  const sourceRecordId = `seed:v${REGISTRY_VERSION}:source:${subjectKey}`;
  const externalId = `${input.sourceSheet}!${String(input.sourceRow)}`;
  const sourceRecord = await prisma.sourceRecord.upsert({
    where: { id: sourceRecordId },
    create: {
      externalId,
      id: sourceRecordId,
      notes: `Imported from registry v${REGISTRY_VERSION}; source status: ${input.sourceStatus ?? "not supplied"}.`,
      payloadHash: payloadHash(input.record),
      retrievedAt: SOURCE_VERIFIED_AT,
      sourceId,
      sourceUrl: input.sourceUrl,
      subjectId: input.subjectId,
      subjectType: input.subjectType,
    },
    update: {
      externalId,
      notes: `Imported from registry v${REGISTRY_VERSION}; source status: ${input.sourceStatus ?? "not supplied"}.`,
      payloadHash: payloadHash(input.record),
      retrievedAt: SOURCE_VERIFIED_AT,
      sourceId,
      sourceUrl: input.sourceUrl,
    },
  });
  const verificationId = `seed:v${REGISTRY_VERSION}:verification:${subjectKey}`;
  await prisma.verificationEvent.upsert({
    where: { id: verificationId },
    create: {
      id: verificationId,
      notes: `Normalized from source status: ${input.sourceStatus ?? "not supplied"}.`,
      outcome: verificationOutcome(input.verificationStatus),
      sourceRecordId: sourceRecord.id,
      subjectId: input.subjectId,
      subjectType: input.subjectType,
      verifiedAt: SOURCE_VERIFIED_AT,
    },
    update: {
      notes: `Normalized from source status: ${input.sourceStatus ?? "not supplied"}.`,
      outcome: verificationOutcome(input.verificationStatus),
      sourceRecordId: sourceRecord.id,
      verifiedAt: SOURCE_VERIFIED_AT,
    },
  });
}

export async function seedRegistry(prisma: PrismaClient): Promise<void> {
  validateManifests();

  for (const record of institutionManifest.records) {
    const institutionType = requireEnumValue(
      InstitutionType,
      record.institutionType,
      `${record.institutionId} type`,
    );
    const branch = requireEnumValue(
      GovernmentBranch,
      record.branch,
      `${record.institutionId} branch`,
    );
    const verificationStatus = requireEnumValue(
      VerificationStatus,
      record.verificationStatus,
      `${record.institutionId} verification status`,
    );
    await prisma.institution.upsert({
      where: { id: record.institutionId },
      create: {
        acronym: record.acronym,
        branch,
        id: record.institutionId,
        institutionType,
        jurisdiction: record.jurisdiction,
        notes: record.notes,
        officialName: record.officialName,
        proposedDataDomain: record.proposedDataDomain,
        proposedRoute: record.proposedRoute,
        verificationStatus,
      },
      update: {
        acronym: record.acronym,
        branch,
        institutionType,
        jurisdiction: record.jurisdiction,
        notes: record.notes,
        officialName: record.officialName,
        proposedDataDomain: record.proposedDataDomain,
        proposedRoute: record.proposedRoute,
        verificationStatus,
      },
    });
    await upsertProvenance(prisma, {
      record,
      sourceRow: record.sourceRow,
      sourceSheet: institutionManifest.sourceSheet,
      sourceStatus: record.verificationStatus,
      sourceUrl: requireSourceUrl(record.sourceUrl),
      subjectId: record.institutionId,
      subjectType: RegistrySubjectType.INSTITUTION,
      verificationStatus,
    });
  }

  const institutionsByAcronym = new Map(
    institutionManifest.records.map((record) => [record.acronym, record.institutionId]),
  );
  for (const record of institutionManifest.records) {
    if (record.parentAcronym === null) {
      continue;
    }
    const parentInstitutionId = institutionsByAcronym.get(record.parentAcronym);
    assert(parentInstitutionId !== undefined, `unresolved parent for ${record.institutionId}.`);
    const relationshipId = `seed:v${REGISTRY_VERSION}:parent:${parentInstitutionId}:${record.institutionId}`;
    await prisma.institutionRelationship.upsert({
      where: { id: relationshipId },
      create: {
        id: relationshipId,
        notes: `Imported from ${institutionManifest.sourceSheet}!${String(record.sourceRow)}.`,
        relationshipType: InstitutionRelationshipType.PARENT_OF,
        sourceInstitutionId: parentInstitutionId,
        targetInstitutionId: record.institutionId,
      },
      update: {
        notes: `Imported from ${institutionManifest.sourceSheet}!${String(record.sourceRow)}.`,
        relationshipType: InstitutionRelationshipType.PARENT_OF,
        sourceInstitutionId: parentInstitutionId,
        targetInstitutionId: record.institutionId,
      },
    });
  }

  for (const record of departmentManifest.records) {
    const verificationStatus = normalizedTerritoryStatus(undefined);
    await prisma.department.upsert({
      where: { id: record.departmentId },
      create: {
        arrondissementCount: record.arrondissementCount,
        capital: record.capital,
        communalSectionCount: record.communalSectionCount,
        communeCount: record.communeCount,
        id: record.departmentId,
        ihsiCode: record.ihsiCode,
        name: record.name,
        proposedRoute: record.proposedRoute,
        quartierCount: record.quartierCount,
        verificationStatus,
      },
      update: {
        arrondissementCount: record.arrondissementCount,
        capital: record.capital,
        communalSectionCount: record.communalSectionCount,
        communeCount: record.communeCount,
        ihsiCode: record.ihsiCode,
        name: record.name,
        proposedRoute: record.proposedRoute,
        quartierCount: record.quartierCount,
        verificationStatus,
      },
    });
    await upsertProvenance(prisma, {
      record,
      sourceRow: record.sourceRow,
      sourceSheet: departmentManifest.sourceSheet,
      sourceStatus: null,
      sourceUrl: requireSourceUrl(record.sourceUrl),
      subjectId: record.departmentId,
      subjectType: RegistrySubjectType.DEPARTMENT,
      verificationStatus,
    });
  }

  for (const record of arrondissementManifest.records) {
    const verificationStatus = normalizedTerritoryStatus(undefined);
    await prisma.arrondissement.upsert({
      where: { id: record.arrondissementId },
      create: {
        communeCount: record.communeCount,
        departmentId: record.departmentId,
        id: record.arrondissementId,
        name: record.name,
        proposedRoute: record.proposedRoute,
        verificationStatus,
      },
      update: {
        communeCount: record.communeCount,
        departmentId: record.departmentId,
        name: record.name,
        proposedRoute: record.proposedRoute,
        verificationStatus,
      },
    });
    await upsertProvenance(prisma, {
      record,
      sourceRow: record.sourceRow,
      sourceSheet: arrondissementManifest.sourceSheet,
      sourceStatus: null,
      sourceUrl: requireSourceUrl(record.sourceUrl),
      subjectId: record.arrondissementId,
      subjectType: RegistrySubjectType.ARRONDISSEMENT,
      verificationStatus,
    });
  }

  for (const record of communeManifest.records) {
    const verificationStatus = normalizedTerritoryStatus(record.sourceVerificationStatus);
    await prisma.commune.upsert({
      where: { id: record.communeId },
      create: {
        arrondissementId: record.arrondissementId,
        id: record.communeId,
        name: record.name,
        proposedRoute: record.proposedRoute,
        verificationStatus,
      },
      update: {
        arrondissementId: record.arrondissementId,
        name: record.name,
        proposedRoute: record.proposedRoute,
        verificationStatus,
      },
    });
    await upsertProvenance(prisma, {
      record,
      sourceRow: record.sourceRow,
      sourceSheet: communeManifest.sourceSheet,
      sourceStatus: record.sourceVerificationStatus,
      sourceUrl: requireSourceUrl(record.sourceUrl),
      subjectId: record.communeId,
      subjectType: RegistrySubjectType.COMMUNE,
      verificationStatus,
    });
  }

  const departmentIdByName = new Map(
    departmentManifest.records.map((record) => [record.name, record.departmentId]),
  );
  const arrondissementIdByKey = new Map(
    arrondissementManifest.records.map((record) => [
      `${record.departmentName}\u0000${record.name}`,
      record.arrondissementId,
    ]),
  );
  const mictInstitutionId = institutionsByAcronym.get("MICT");
  assert(mictInstitutionId !== undefined, "MICT institution could not be resolved.");
  for (const record of officeManifest.records) {
    const departmentId = departmentIdByName.get(record.departmentName);
    assert(departmentId !== undefined, `unresolved department for ${record.officeId}.`);
    const officeType = normalizedOfficeType(record.sourceOfficeType);
    const coverage = normalizedOfficeCoverage(record.sourceCoverage);
    const arrondissementId =
      coverage === InstitutionOfficeCoverage.ARRONDISSEMENT
        ? arrondissementIdByKey.get(`${record.departmentName}\u0000${record.locality}`)
        : undefined;
    if (coverage === InstitutionOfficeCoverage.ARRONDISSEMENT) {
      assert(arrondissementId !== undefined, `unresolved arrondissement for ${record.officeId}.`);
    }
    const verificationStatus = requireEnumValue(
      VerificationStatus,
      record.sourceVerificationStatus,
      `${record.officeId} verification status`,
    );
    await prisma.institutionOffice.upsert({
      where: { id: record.officeId },
      create: {
        arrondissementId: arrondissementId ?? null,
        coverage,
        departmentId,
        id: record.officeId,
        institutionId: mictInstitutionId,
        locality: record.locality,
        officeType,
        verificationStatus,
      },
      update: {
        arrondissementId: arrondissementId ?? null,
        coverage,
        departmentId,
        institutionId: mictInstitutionId,
        locality: record.locality,
        officeType,
        verificationStatus,
      },
    });
    await upsertProvenance(prisma, {
      record,
      sourceRow: record.sourceRow,
      sourceSheet: officeManifest.sourceSheet,
      sourceStatus: record.sourceVerificationStatus,
      sourceUrl: requireSourceUrl(record.sourceUrl),
      subjectId: record.officeId,
      subjectType: RegistrySubjectType.INSTITUTION_OFFICE,
      verificationStatus,
    });
  }

  await prisma.systemMetadata.upsert({
    where: { key: "institution_registry_version" },
    create: { key: "institution_registry_version", value: REGISTRY_VERSION },
    update: { value: REGISTRY_VERSION },
  });
}
