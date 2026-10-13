-- Add source-backed service catalog candidates. Records default to PENDING_REVIEW.
ALTER TYPE "RegistrySubjectType" ADD VALUE 'SERVICE';

CREATE TYPE "ServiceStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'RETIRED');

CREATE TABLE "service_catalog_entries" (
    "id" TEXT NOT NULL,
    "institution_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'fr',
    "status" "ServiceStatus" NOT NULL DEFAULT 'DRAFT',
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_catalog_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "service_catalog_entries_institution_id_idx" ON "service_catalog_entries"("institution_id");
CREATE INDEX "service_catalog_entries_status_verification_status_idx" ON "service_catalog_entries"("status", "verification_status");
