import {
  type PublicServiceListResponse,
  type ServiceListQuery,
  serviceListQuerySchema,
} from "@haitigov/contracts";
import { BadRequestException, Controller, Get, Inject, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import type { ZodError } from "zod";

import { PublicServicesService } from "./services.service.js";

function validationException(error: ZodError): BadRequestException {
  return new BadRequestException({
    code: "VALIDATION_FAILED",
    details: error.issues.map((issue) => ({
      code: issue.code,
      message: issue.message,
      path: issue.path,
    })),
    message: "The service request is invalid.",
  });
}

@ApiTags("services")
@Controller("services")
export class ServicesController {
  constructor(@Inject(PublicServicesService) private readonly services: PublicServicesService) {}

  @Get()
  @ApiOperation({ summary: "List publicly verified services" })
  @ApiOkResponse({
    description: "Only published and currently verified service DTOs are returned.",
  })
  @ApiQuery({ name: "institutionId", required: false, type: String })
  @ApiQuery({ name: "locale", required: false, type: String })
  @ApiQuery({ name: "q", required: false, type: String })
  async list(@Query() rawQuery: Record<string, unknown>): Promise<PublicServiceListResponse> {
    const result = serviceListQuerySchema.safeParse(rawQuery);
    if (!result.success) throw validationException(result.error);
    return this.services.list(result.data satisfies ServiceListQuery);
  }
}
