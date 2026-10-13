import type {
  PublicInstitutionAlias,
  PublicInstitutionDetail,
  PublicInstitutionOffice,
  PublicInstitutionRelationship,
  PublicInstitutionSource,
  PublicInstitutionSummary,
  PublicVerificationEvent,
} from "@haitigov/contracts";

import type {
  InstitutionDetailAggregate,
  InstitutionDetailRecord,
  InstitutionSourceRecord,
  InstitutionSummaryRecord,
  InstitutionVerificationRecord,
} from "./institutions.repository.js";

function toIso(value: Date | null): string | null {
  return value?.toISOString() ?? null;
}

function mapAliases(
  record: InstitutionSummaryRecord | InstitutionDetailRecord,
): PublicInstitutionAlias[] {
  return record.aliases.map((alias) => ({
    aliasType: alias.aliasType,
    isPreferred: alias.isPreferred,
    locale: alias.locale,
    name: alias.name,
    validFrom: toIso(alias.validFrom),
    validTo: toIso(alias.validTo),
  }));
}

interface ParentRelationshipReference {
  readonly sourceInstitutionId: string;
}

function findParentInstitutionId(
  relationships: readonly ParentRelationshipReference[],
): string | null {
  return relationships[0]?.sourceInstitutionId ?? null;
}

export function mapInstitutionSummary(record: InstitutionSummaryRecord): PublicInstitutionSummary {
  return {
    acronym: record.acronym,
    aliases: mapAliases(record),
    branch: record.branch,
    institutionId: record.id,
    officialName: record.officialName,
    parentInstitutionId: findParentInstitutionId(record.incomingRelationships),
    status: record.status,
    type: record.institutionType,
    verificationStatus: record.verificationStatus,
  };
}

function mapRelationships(record: InstitutionDetailRecord): PublicInstitutionRelationship[] {
  const incoming = record.incomingRelationships.map((relationship) => ({
    direction: "incoming" as const,
    effectiveFrom: toIso(relationship.effectiveFrom),
    effectiveTo: toIso(relationship.effectiveTo),
    institutionAcronym: relationship.sourceInstitution.acronym,
    institutionId: relationship.sourceInstitution.id,
    institutionName: relationship.sourceInstitution.officialName,
    relationshipType: relationship.relationshipType,
  }));
  const outgoing = record.outgoingRelationships.map((relationship) => ({
    direction: "outgoing" as const,
    effectiveFrom: toIso(relationship.effectiveFrom),
    effectiveTo: toIso(relationship.effectiveTo),
    institutionAcronym: relationship.targetInstitution.acronym,
    institutionId: relationship.targetInstitution.id,
    institutionName: relationship.targetInstitution.officialName,
    relationshipType: relationship.relationshipType,
  }));

  return [...incoming, ...outgoing];
}

function mapSource(record: InstitutionSourceRecord): PublicInstitutionSource {
  return {
    effectiveFrom: toIso(record.effectiveFrom),
    effectiveTo: toIso(record.effectiveTo),
    retrievedAt: toIso(record.retrievedAt),
    sourceInstitution: record.source.sourceInstitution,
    sourceName: record.source.name,
    sourceUrl: record.sourceUrl ?? record.source.sourceUrl,
  };
}

function mapOffices(record: InstitutionDetailRecord): PublicInstitutionOffice[] {
  return record.offices.map((office) => ({
    arrondissement:
      office.arrondissement === null
        ? null
        : {
            arrondissementId: office.arrondissement.id,
            name: office.arrondissement.name,
          },
    coverage: office.coverage,
    department: {
      departmentId: office.department.id,
      name: office.department.name,
    },
    locality: office.locality,
    officeId: office.id,
    officeType: office.officeType,
    verificationStatus: office.verificationStatus,
  }));
}

function mapVerificationEvent(record: InstitutionVerificationRecord): PublicVerificationEvent {
  return {
    outcome: record.outcome,
    verifiedAt: record.verifiedAt.toISOString(),
  };
}

export function mapInstitutionDetail(
  aggregate: InstitutionDetailAggregate,
): PublicInstitutionDetail {
  const { institution } = aggregate;
  return {
    acronym: institution.acronym,
    aliases: mapAliases(institution),
    branch: institution.branch,
    institutionId: institution.id,
    jurisdiction: institution.jurisdiction,
    offices: mapOffices(institution),
    officialName: institution.officialName,
    parentInstitutionId: findParentInstitutionId(
      institution.incomingRelationships.filter(
        (relationship) => relationship.relationshipType === "PARENT_OF",
      ),
    ),
    relationships: mapRelationships(institution),
    sources: aggregate.sources.map(mapSource),
    status: institution.status,
    type: institution.institutionType,
    verificationEvents: aggregate.verificationEvents.map(mapVerificationEvent),
    verificationStatus: institution.verificationStatus,
  };
}
