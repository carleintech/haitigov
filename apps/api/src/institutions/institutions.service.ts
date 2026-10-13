import type {
  InstitutionListQuery,
  InstitutionRelationshipType,
  PublicInstitutionDetail,
  PublicInstitutionListResponse,
} from "@haitigov/contracts";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { assertCanonicalInstitutionId, assertRelationshipAllowed } from "./institution-policy.js";
import { mapInstitutionDetail, mapInstitutionSummary } from "./institutions.mapper.js";
import { INSTITUTION_READER, type InstitutionReader } from "./institutions.repository.js";

@Injectable()
export class InstitutionsService {
  constructor(@Inject(INSTITUTION_READER) private readonly repository: InstitutionReader) {}

  async list(query: InstitutionListQuery): Promise<PublicInstitutionListResponse> {
    const page = await this.repository.findMany(query);
    const items = page.records.map(mapInstitutionSummary);

    return {
      items,
      nextCursor: page.hasMore ? (items.at(-1)?.institutionId ?? null) : null,
    };
  }

  async getById(institutionId: string): Promise<PublicInstitutionDetail> {
    assertCanonicalInstitutionId(institutionId);
    const record = await this.repository.findById(institutionId);
    if (record === null) {
      throw new NotFoundException({
        code: "NOT_FOUND",
        message: `Institution ${institutionId} was not found.`,
      });
    }

    return mapInstitutionDetail(record);
  }

  async assertRelationshipAllowed(
    sourceInstitutionId: string,
    targetInstitutionId: string,
    relationshipType: InstitutionRelationshipType,
  ): Promise<void> {
    const parentEdges = await this.repository.listParentEdges();
    assertRelationshipAllowed(
      sourceInstitutionId,
      targetInstitutionId,
      relationshipType,
      parentEdges,
    );
  }
}
