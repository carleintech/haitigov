import type { ServiceListQuery } from "@haitigov/contracts";

import { ServiceStatus, VerificationStatus } from "@haitigov/database";
import { Inject, Injectable } from "@nestjs/common";

import { DatabaseService } from "../database/database.module.js";

export interface PublicServicePage {
  readonly hasMore: boolean;
  readonly records: readonly {
    readonly description: string | null;
    readonly id: string;
    readonly institutionId: string | null;
    readonly name: string;
    readonly status: ServiceStatus;
    readonly verificationStatus: VerificationStatus;
  }[];
}

export const PUBLIC_SERVICE_READER = Symbol("PUBLIC_SERVICE_READER");

export interface PublicServiceReader {
  findMany(query: ServiceListQuery): Promise<PublicServicePage>;
}

@Injectable()
export class PrismaPublicServiceRepository implements PublicServiceReader {
  constructor(@Inject(DatabaseService) private readonly database: DatabaseService) {}

  async findMany(query: ServiceListQuery): Promise<PublicServicePage> {
    const records = await this.database.client.serviceCatalogEntry.findMany({
      orderBy: { id: "asc" },
      take: 101,
      where: {
        ...(query.institutionId === undefined ? {} : { institutionId: query.institutionId }),
        ...(query.q === undefined ? {} : { name: { contains: query.q, mode: "insensitive" } }),
        status: ServiceStatus.PUBLISHED,
        verificationStatus: VerificationStatus.VERIFIED_CURRENT,
      },
    });
    const hasMore = records.length > 100;
    return { hasMore, records: hasMore ? records.slice(0, 100) : records };
  }
}
