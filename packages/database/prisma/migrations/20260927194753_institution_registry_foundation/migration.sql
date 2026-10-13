-- CreateEnum
CREATE TYPE "InstitutionStatus" AS ENUM ('UNKNOWN', 'ACTIVE', 'INACTIVE', 'HISTORICAL', 'SUPERSEDED');

-- AlterTable
ALTER TABLE "institutions" ADD COLUMN     "status" "InstitutionStatus" NOT NULL DEFAULT 'UNKNOWN';

-- CreateIndex
CREATE INDEX "institutions_status_idx" ON "institutions"("status");

-- Prevent invalid relationships even when a future write path bypasses the domain service.
ALTER TABLE "institution_relationships"
ADD CONSTRAINT "institution_relationships_no_self_reference"
CHECK ("source_institution_id" <> "target_institution_id");
