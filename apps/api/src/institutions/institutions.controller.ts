import {
  governmentBranches,
  type InstitutionListQuery,
  institutionIdSchema,
  institutionListQuerySchema,
  institutionStatuses,
  institutionTypes,
  type PublicInstitutionDetail,
  type PublicInstitutionListResponse,
  publicInstitutionVerificationStatuses,
} from "@haitigov/contracts";
import { BadRequestException, Controller, Get, Inject, Param, Query } from "@nestjs/common";
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import type { ZodError } from "zod";

import { InstitutionsService } from "./institutions.service.js";

function validationException(error: ZodError): BadRequestException {
  return new BadRequestException({
    code: "VALIDATION_FAILED",
    details: error.issues.map((issue) => ({
      code: issue.code,
      message: issue.message,
      path: issue.path,
    })),
    message: "The institution request is invalid.",
  });
}

@ApiTags("institutions")
@Controller("institutions")
export class InstitutionsController {
  constructor(@Inject(InstitutionsService) private readonly institutions: InstitutionsService) {}

  @Get()
  @ApiOperation({ summary: "List and search public institution records" })
  @ApiOkResponse({ description: "A cursor-paginated list of public institution DTOs." })
  @ApiQuery({ enum: institutionTypes, name: "type", required: false })
  @ApiQuery({ enum: governmentBranches, name: "branch", required: false })
  @ApiQuery({ enum: institutionStatuses, name: "status", required: false })
  @ApiQuery({
    enum: publicInstitutionVerificationStatuses,
    name: "verificationStatus",
    required: false,
  })
  @ApiQuery({ name: "parent", required: false, type: String })
  @ApiQuery({ name: "q", required: false, type: String })
  @ApiQuery({ name: "cursor", required: false, type: String })
  @ApiQuery({ maximum: 100, minimum: 1, name: "limit", required: false, type: Number })
  async list(@Query() rawQuery: Record<string, unknown>): Promise<PublicInstitutionListResponse> {
    const result = institutionListQuerySchema.safeParse(rawQuery);
    if (!result.success) {
      throw validationException(result.error);
    }

    return this.institutions.list(result.data satisfies InstitutionListQuery);
  }

  @Get(":institutionId")
  @ApiOperation({ summary: "Get a public institution record by canonical ID" })
  @ApiOkResponse({ description: "The public institution DTO with provenance metadata." })
  @ApiNotFoundResponse({ description: "No institution exists with the supplied canonical ID." })
  @ApiParam({ example: "HT-MIN-001", name: "institutionId" })
  async getById(@Param("institutionId") institutionId: string): Promise<PublicInstitutionDetail> {
    const result = institutionIdSchema.safeParse(institutionId);
    if (!result.success) {
      throw validationException(result.error);
    }

    return this.institutions.getById(result.data);
  }
}
