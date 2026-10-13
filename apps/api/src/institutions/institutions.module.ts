import { Module } from "@nestjs/common";

import { InstitutionsController } from "./institutions.controller.js";
import { INSTITUTION_READER, PrismaInstitutionRepository } from "./institutions.repository.js";
import { InstitutionsService } from "./institutions.service.js";

@Module({
  controllers: [InstitutionsController],
  providers: [
    PrismaInstitutionRepository,
    InstitutionsService,
    { provide: INSTITUTION_READER, useExisting: PrismaInstitutionRepository },
  ],
})
// NestJS uses this metadata-only class as the institution domain module token.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class InstitutionsModule {}
