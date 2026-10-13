import { Module } from "@nestjs/common";

import { DatabaseModule } from "./database/database.module.js";
import { InstitutionsModule } from "./institutions/institutions.module.js";
import { ServicesModule } from "./services/services.module.js";

@Module({
  imports: [DatabaseModule, InstitutionsModule, ServicesModule],
})
// NestJS uses this metadata-only class as the application module token.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}
