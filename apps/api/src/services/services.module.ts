import { Module } from "@nestjs/common";

import { ServicesController } from "./services.controller.js";
import { PrismaPublicServiceRepository, PUBLIC_SERVICE_READER } from "./services.repository.js";
import { PublicServicesService } from "./services.service.js";

@Module({
  controllers: [ServicesController],
  providers: [
    PrismaPublicServiceRepository,
    PublicServicesService,
    { provide: PUBLIC_SERVICE_READER, useExisting: PrismaPublicServiceRepository },
  ],
})
// NestJS uses this metadata-only class as the service domain module token.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ServicesModule {}
