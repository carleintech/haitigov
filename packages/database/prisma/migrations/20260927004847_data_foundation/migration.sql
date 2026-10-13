-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('AUTONOMOUS_BODY', 'CENTRAL_DIRECTORATE', 'DECONCENTRATED_SERVICE', 'EXECUTIVE_COUNCIL', 'MINISTRY', 'PRESIDENCY', 'PRIMATURE', 'PUBLIC_BODY', 'PUBLIC_ENTERPRISE', 'PUBLIC_FINANCIAL_INSTITUTION', 'REGULATORY_AUTHORITY', 'OTHER');

-- CreateEnum
CREATE TYPE "GovernmentBranch" AS ENUM ('EXECUTIVE', 'JUDICIAL', 'LEGISLATIVE', 'INDEPENDENT', 'TERRITORIAL', 'OTHER');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING_REVIEW', 'PARTIALLY_VERIFIED', 'VERIFIED_CURRENT', 'VERIFIED_LEGACY', 'SUPERSEDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InstitutionAliasType" AS ENUM ('ACRONYM', 'FORMER_NAME', 'SHORT_NAME', 'TRANSLATION', 'OTHER');

-- CreateEnum
CREATE TYPE "InstitutionRelationshipType" AS ENUM ('PARENT_OF', 'OVERSEES', 'COORDINATES', 'SUCCESSOR_OF', 'PREDECESSOR_OF', 'RELATED_TO');

-- CreateEnum
CREATE TYPE "TerritoryLevel" AS ENUM ('DEPARTMENT', 'ARRONDISSEMENT', 'COMMUNE', 'COMMUNAL_SECTION');

-- CreateEnum
CREATE TYPE "RegistrySubjectType" AS ENUM ('INSTITUTION', 'DEPARTMENT', 'ARRONDISSEMENT', 'COMMUNE', 'COMMUNAL_SECTION', 'DATA_CLASSIFICATION');

-- CreateEnum
CREATE TYPE "VerificationOutcome" AS ENUM ('CONFIRMED', 'PARTIALLY_CONFIRMED', 'UNRESOLVED', 'REJECTED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "AuditResult" AS ENUM ('SUCCESS', 'FAILURE', 'DENIED', 'ERROR');

-- CreateTable
CREATE TABLE "system_metadata" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_classifications" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_classifications_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "institutions" (
    "id" TEXT NOT NULL,
    "acronym" TEXT,
    "official_name" TEXT NOT NULL,
    "institution_type" "InstitutionType" NOT NULL,
    "branch" "GovernmentBranch" NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "proposed_data_domain" TEXT,
    "proposed_route" TEXT,
    "notes" TEXT,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "data_classification_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_aliases" (
    "id" TEXT NOT NULL,
    "institution_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alias_type" "InstitutionAliasType" NOT NULL,
    "locale" TEXT,
    "is_preferred" BOOLEAN NOT NULL DEFAULT false,
    "valid_from" TIMESTAMP(3),
    "valid_to" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institution_aliases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_relationships" (
    "id" TEXT NOT NULL,
    "source_institution_id" TEXT NOT NULL,
    "target_institution_id" TEXT NOT NULL,
    "relationship_type" "InstitutionRelationshipType" NOT NULL,
    "effective_from" TIMESTAMP(3),
    "effective_to" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institution_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "ihsi_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capital" TEXT NOT NULL,
    "arrondissement_count" INTEGER,
    "commune_count" INTEGER,
    "communal_section_count" INTEGER,
    "quartier_count" INTEGER,
    "proposed_route" TEXT,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "boundary" geometry(MultiPolygon, 4326),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arrondissements" (
    "id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "commune_count" INTEGER,
    "proposed_route" TEXT,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "boundary" geometry(MultiPolygon, 4326),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "arrondissements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communes" (
    "id" TEXT NOT NULL,
    "arrondissement_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "proposed_route" TEXT,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "boundary" geometry(MultiPolygon, 4326),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "communes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communal_sections" (
    "id" TEXT NOT NULL,
    "commune_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "proposed_route" TEXT,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "boundary" geometry(MultiPolygon, 4326),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "communal_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "source_url" TEXT,
    "source_institution" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_records" (
    "id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "subject_type" "RegistrySubjectType" NOT NULL,
    "subject_id" TEXT NOT NULL,
    "external_id" TEXT,
    "source_url" TEXT,
    "retrieved_at" TIMESTAMP(3),
    "effective_from" TIMESTAMP(3),
    "effective_to" TIMESTAMP(3),
    "payload_hash" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "source_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_events" (
    "id" TEXT NOT NULL,
    "subject_type" "RegistrySubjectType" NOT NULL,
    "subject_id" TEXT NOT NULL,
    "source_record_id" TEXT,
    "outcome" "VerificationOutcome" NOT NULL,
    "verified_at" TIMESTAMP(3) NOT NULL,
    "verified_by" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" TEXT NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_id" TEXT,
    "institution_id" TEXT,
    "action" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT,
    "purpose" TEXT,
    "result" "AuditResult" NOT NULL,
    "correlation_id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "security_context" JSONB,
    "metadata" JSONB,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_metadata_key_key" ON "system_metadata"("key");

-- CreateIndex
CREATE UNIQUE INDEX "data_classifications_rank_key" ON "data_classifications"("rank");

-- CreateIndex
CREATE UNIQUE INDEX "institutions_proposed_route_key" ON "institutions"("proposed_route");

-- CreateIndex
CREATE INDEX "institutions_acronym_idx" ON "institutions"("acronym");

-- CreateIndex
CREATE INDEX "institutions_institution_type_idx" ON "institutions"("institution_type");

-- CreateIndex
CREATE INDEX "institutions_verification_status_idx" ON "institutions"("verification_status");

-- CreateIndex
CREATE INDEX "institution_aliases_name_idx" ON "institution_aliases"("name");

-- CreateIndex
CREATE UNIQUE INDEX "institution_aliases_institution_id_name_alias_type_locale_key" ON "institution_aliases"("institution_id", "name", "alias_type", "locale");

-- CreateIndex
CREATE INDEX "institution_relationships_target_institution_id_relationshi_idx" ON "institution_relationships"("target_institution_id", "relationship_type");

-- CreateIndex
CREATE UNIQUE INDEX "institution_relationships_source_institution_id_target_inst_key" ON "institution_relationships"("source_institution_id", "target_institution_id", "relationship_type", "effective_from");

-- CreateIndex
CREATE UNIQUE INDEX "departments_ihsi_code_key" ON "departments"("ihsi_code");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_proposed_route_key" ON "departments"("proposed_route");

-- CreateIndex
CREATE UNIQUE INDEX "arrondissements_proposed_route_key" ON "arrondissements"("proposed_route");

-- CreateIndex
CREATE INDEX "arrondissements_department_id_idx" ON "arrondissements"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "arrondissements_department_id_name_key" ON "arrondissements"("department_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "communes_proposed_route_key" ON "communes"("proposed_route");

-- CreateIndex
CREATE INDEX "communes_arrondissement_id_idx" ON "communes"("arrondissement_id");

-- CreateIndex
CREATE UNIQUE INDEX "communes_arrondissement_id_name_key" ON "communes"("arrondissement_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "communal_sections_proposed_route_key" ON "communal_sections"("proposed_route");

-- CreateIndex
CREATE INDEX "communal_sections_commune_id_idx" ON "communal_sections"("commune_id");

-- CreateIndex
CREATE UNIQUE INDEX "communal_sections_commune_id_name_key" ON "communal_sections"("commune_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "sources_name_source_url_key" ON "sources"("name", "source_url");

-- CreateIndex
CREATE INDEX "source_records_subject_type_subject_id_idx" ON "source_records"("subject_type", "subject_id");

-- CreateIndex
CREATE INDEX "source_records_source_id_idx" ON "source_records"("source_id");

-- CreateIndex
CREATE INDEX "verification_events_subject_type_subject_id_verified_at_idx" ON "verification_events"("subject_type", "subject_id", "verified_at");

-- CreateIndex
CREATE INDEX "verification_events_source_record_id_idx" ON "verification_events"("source_record_id");

-- CreateIndex
CREATE INDEX "audit_events_occurred_at_idx" ON "audit_events"("occurred_at");

-- CreateIndex
CREATE INDEX "audit_events_actor_id_occurred_at_idx" ON "audit_events"("actor_id", "occurred_at");

-- CreateIndex
CREATE INDEX "audit_events_institution_id_occurred_at_idx" ON "audit_events"("institution_id", "occurred_at");

-- CreateIndex
CREATE INDEX "audit_events_correlation_id_idx" ON "audit_events"("correlation_id");

-- CreateIndex
CREATE INDEX "audit_events_resource_type_resource_id_idx" ON "audit_events"("resource_type", "resource_id");

-- AddForeignKey
ALTER TABLE "institutions" ADD CONSTRAINT "institutions_data_classification_code_fkey" FOREIGN KEY ("data_classification_code") REFERENCES "data_classifications"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_aliases" ADD CONSTRAINT "institution_aliases_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_relationships" ADD CONSTRAINT "institution_relationships_source_institution_id_fkey" FOREIGN KEY ("source_institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_relationships" ADD CONSTRAINT "institution_relationships_target_institution_id_fkey" FOREIGN KEY ("target_institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arrondissements" ADD CONSTRAINT "arrondissements_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communes" ADD CONSTRAINT "communes_arrondissement_id_fkey" FOREIGN KEY ("arrondissement_id") REFERENCES "arrondissements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communal_sections" ADD CONSTRAINT "communal_sections_commune_id_fkey" FOREIGN KEY ("commune_id") REFERENCES "communes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_records" ADD CONSTRAINT "source_records_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_events" ADD CONSTRAINT "verification_events_source_record_id_fkey" FOREIGN KEY ("source_record_id") REFERENCES "source_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;
