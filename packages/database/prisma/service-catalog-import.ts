import {
  type PrismaClient,
  RegistrySubjectType,
  ServiceStatus,
  VerificationStatus,
} from "../generated/prisma/client.js";

const SOURCE_URL = "https://www.servicespublics.gouv.ht/site/services";
const RETRIEVED_AT = new Date("2026-10-02T00:00:00.000Z");

const candidates = [
  {
    id: "OMRH-CRA-SVC-ACCOMPAGNEMENT-FEMMES-FILLES",
    name: "Accompagnement des Femmes et Filles victimes de violences spécifiques",
  },
  { id: "OMRH-CRA-SVC-ACHAT-ELECTRICITE", name: "Achat d'électricité" },
  { id: "OMRH-CRA-SVC-AJOUT-RETRAIT-NOM-MARITAL", name: "Ajout ou retrait de nom marital" },
] as const;

export async function seedServiceCatalogCandidates(prisma: PrismaClient): Promise<void> {
  const source = await prisma.source.upsert({
    where: {
      name_sourceUrl: { name: "OMRH-CRA Services Publics service catalog", sourceUrl: SOURCE_URL },
    },
    create: {
      name: "OMRH-CRA Services Publics service catalog",
      sourceInstitution: "OMRH/CRA Services Publics",
      sourceUrl: SOURCE_URL,
      description:
        "Candidate source only; records require institution-owner or second-source review.",
    },
    update: {
      description:
        "Candidate source only; records require institution-owner or second-source review.",
    },
  });

  for (const candidate of candidates) {
    await prisma.serviceCatalogEntry.upsert({
      where: { id: candidate.id },
      create: {
        id: candidate.id,
        locale: "fr",
        name: candidate.name,
        status: ServiceStatus.DRAFT,
        verificationStatus: VerificationStatus.PENDING_REVIEW,
      },
      update: {
        name: candidate.name,
        status: ServiceStatus.DRAFT,
        verificationStatus: VerificationStatus.PENDING_REVIEW,
      },
    });

    await prisma.sourceRecord.upsert({
      where: { id: `seed-source-record-${candidate.id}` },
      create: {
        id: `seed-source-record-${candidate.id}`,
        externalId: candidate.id,
        notes: "Imported as an unverified candidate; do not publish without review.",
        retrievedAt: RETRIEVED_AT,
        sourceId: source.id,
        sourceUrl: SOURCE_URL,
        subjectId: candidate.id,
        subjectType: RegistrySubjectType.SERVICE,
      },
      update: {
        notes: "Imported as an unverified candidate; do not publish without review.",
        retrievedAt: RETRIEVED_AT,
        sourceId: source.id,
        sourceUrl: SOURCE_URL,
      },
    });
  }
}
