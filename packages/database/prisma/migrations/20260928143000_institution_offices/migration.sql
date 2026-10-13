-- Extend provenance subjects to cover source-backed territorial offices.
ALTER TYPE "RegistrySubjectType" ADD VALUE 'INSTITUTION_OFFICE';

-- CreateEnum
CREATE TYPE "InstitutionOfficeType" AS ENUM ('DELEGATION', 'VICE_DELEGATION');

-- CreateEnum
CREATE TYPE "InstitutionOfficeCoverage" AS ENUM ('DEPARTMENT', 'ARRONDISSEMENT');

-- CreateTable
CREATE TABLE "institution_offices" (
    "id" TEXT NOT NULL,
    "institution_id" TEXT NOT NULL,
    "office_type" "InstitutionOfficeType" NOT NULL,
    "department_id" TEXT NOT NULL,
    "arrondissement_id" TEXT,
    "locality" TEXT NOT NULL,
    "coverage" "InstitutionOfficeCoverage" NOT NULL,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institution_offices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "institution_offices_institution_id_idx" ON "institution_offices"("institution_id");

-- CreateIndex
CREATE INDEX "institution_offices_department_id_idx" ON "institution_offices"("department_id");

-- CreateIndex
CREATE INDEX "institution_offices_arrondissement_id_idx" ON "institution_offices"("arrondissement_id");

-- CreateIndex
CREATE INDEX "institution_offices_verification_status_idx" ON "institution_offices"("verification_status");

-- AddForeignKey
ALTER TABLE "institution_offices" ADD CONSTRAINT "institution_offices_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_offices" ADD CONSTRAINT "institution_offices_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_offices" ADD CONSTRAINT "institution_offices_arrondissement_id_fkey" FOREIGN KEY ("arrondissement_id") REFERENCES "arrondissements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Keep office type, coverage and territorial target consistent even if a future
-- write path bypasses the domain service.
ALTER TABLE "institution_offices"
ADD CONSTRAINT "institution_offices_coverage_matches_type"
CHECK (
  ("office_type" = 'DELEGATION' AND "coverage" = 'DEPARTMENT' AND "arrondissement_id" IS NULL)
  OR
  ("office_type" = 'VICE_DELEGATION' AND "coverage" = 'ARRONDISSEMENT' AND "arrondissement_id" IS NOT NULL)
);
