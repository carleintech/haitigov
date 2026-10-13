import type { PublicServiceListResponse, ServiceListQuery } from "@haitigov/contracts";
import { Inject, Injectable } from "@nestjs/common";

import { PUBLIC_SERVICE_READER, type PublicServiceReader } from "./services.repository.js";

@Injectable()
export class PublicServicesService {
  constructor(@Inject(PUBLIC_SERVICE_READER) private readonly repository: PublicServiceReader) {}

  async list(query: ServiceListQuery): Promise<PublicServiceListResponse> {
    const page = await this.repository.findMany(query);
    const items = page.records.map((record) => ({
      description: record.description ?? "",
      institutionId: record.institutionId ?? "",
      name: record.name,
      serviceId: record.id,
      status: record.status,
      verificationStatus: record.verificationStatus,
    }));
    return { items, nextCursor: page.hasMore ? (items.at(-1)?.serviceId ?? null) : null };
  }
}
