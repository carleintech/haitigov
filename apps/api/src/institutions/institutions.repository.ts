import type { InstitutionListQuery } from "@haitigov/contracts";
import {
  InstitutionRelationshipType,
  type Prisma,
  RegistrySubjectType,
  type VerificationEvent,
  VerificationStatus,
} from "@haitigov/database";
import { Inject, Injectable } from "@nestjs/common";

import { DatabaseService } from "../database/database.module.js";
import type { ParentRelationshipEdge } from "./institution-policy.js";

const institutionSummaryInclude = {
  aliases: {
    orderBy: [{ isPreferred: "desc" }, { name: "asc" }],
  },
  incomingRelationships: {
    orderBy: { sourceInstitutionId: "asc" },
    select: { sourceInstitutionId: true },
    where: { relationshipType: InstitutionRelationshipType.PARENT_OF },
  },
} satisfies Prisma.InstitutionInclude;

const institutionDetailInclude = {
  aliases: {
    orderBy: [{ isPreferred: "desc" }, { name: "asc" }],
  },
  incomingRelationships: {
    include: {
      sourceInstitution: {
        select: { acronym: true, id: true, officialName: true },
      },
    },
    orderBy: [{ relationshipType: "asc" }, { sourceInstitutionId: "asc" }],
  },
  outgoingRelationships: {
    include: {
      targetInstitution: {
        select: { acronym: true, id: true, officialName: true },
      },
    },
    orderBy: [{ relationshipType: "asc" }, { targetInstitutionId: "asc" }],
  },
  offices: {
    include: {
      arrondissement: {
        select: { id: true, name: true },
      },
      department: {
        select: { id: true, name: true },
      },
    },
    orderBy: { id: "asc" },
  },
} satisfies Prisma.InstitutionInclude;

export type InstitutionSummaryRecord = Prisma.InstitutionGetPayload<{
  include: typeof institutionSummaryInclude;
}>;

export type InstitutionDetailRecord = Prisma.InstitutionGetPayload<{
  include: typeof institutionDetailInclude;
}>;

export type InstitutionSourceRecord = Prisma.SourceRecordGetPayload<{
  include: { source: true };
}>;

export type InstitutionVerificationRecord = VerificationEvent;

export interface InstitutionDetailAggregate {
  readonly institution: InstitutionDetailRecord;
  readonly sources: readonly InstitutionSourceRecord[];
  readonly verificationEvents: readonly InstitutionVerificationRecord[];
}

export interface InstitutionPage {
  readonly hasMore: boolean;
  readonly records: readonly InstitutionSummaryRecord[];
}

export interface InstitutionReader {
  findById(institutionId: string): Promise<InstitutionDetailAggregate | null>;
  findMany(query: InstitutionListQuery): Promise<InstitutionPage>;
  listParentEdges(): Promise<readonly ParentRelationshipEdge[]>;
}

export const INSTITUTION_READER = Symbol("INSTITUTION_READER");

@Injectable()
export class PrismaInstitutionRepository implements InstitutionReader {
  constructor(@Inject(DatabaseService) private readonly database: DatabaseService) {}

  async findMany(query: InstitutionListQuery): Promise<InstitutionPage> {
    const where: Prisma.InstitutionWhereInput = {
      ...(query.cursor === undefined ? {} : { id: { gt: query.cursor } }),
      ...(query.branch === undefined ? {} : { branch: query.branch }),
      ...(query.parent === undefined
        ? {}
        : {
            incomingRelationships: {
              some: {
                relationshipType: InstitutionRelationshipType.PARENT_OF,
                sourceInstitutionId: query.parent,
              },
            },
          }),
      ...(query.q === undefined
        ? {}
        : {
            OR: [
              { officialName: { contains: query.q, mode: "insensitive" } },
              { acronym: { contains: query.q, mode: "insensitive" } },
              { aliases: { some: { name: { contains: query.q, mode: "insensitive" } } } },
            ],
          }),
      ...(query.status === undefined ? {} : { status: query.status }),
      ...(query.type === undefined ? {} : { institutionType: query.type }),
      verificationStatus:
        query.verificationStatus === undefined
          ? {
              in: [VerificationStatus.VERIFIED_CURRENT, VerificationStatus.VERIFIED_LEGACY],
            }
          : VerificationStatus[query.verificationStatus],
    };
    const records = await this.database.client.institution.findMany({
      include: institutionSummaryInclude,
      orderBy: { id: "asc" },
      take: query.limit + 1,
      where,
    });
    const hasMore = records.length > query.limit;

    return {
      hasMore,
      records: hasMore ? records.slice(0, query.limit) : records,
    };
  }

  async findById(institutionId: string): Promise<InstitutionDetailAggregate | null> {
    const institution = await this.database.client.institution.findFirst({
      include: institutionDetailInclude,
      where: {
        id: institutionId,
        verificationStatus: {
          in: [VerificationStatus.VERIFIED_CURRENT, VerificationStatus.VERIFIED_LEGACY],
        },
      },
    });
    if (institution === null) {
      return null;
    }

    const [sources, verificationEvents] = await Promise.all([
      this.database.client.sourceRecord.findMany({
        include: { source: true },
        orderBy: [{ retrievedAt: "desc" }, { createdAt: "desc" }],
        where: { subjectId: institutionId, subjectType: RegistrySubjectType.INSTITUTION },
      }),
      this.database.client.verificationEvent.findMany({
        orderBy: [{ verifiedAt: "desc" }, { createdAt: "desc" }],
        where: { subjectId: institutionId, subjectType: RegistrySubjectType.INSTITUTION },
      }),
    ]);

    return { institution, sources, verificationEvents };
  }

  async listParentEdges(): Promise<readonly ParentRelationshipEdge[]> {
    const records = await this.database.client.institutionRelationship.findMany({
      select: { sourceInstitutionId: true, targetInstitutionId: true },
      where: { relationshipType: InstitutionRelationshipType.PARENT_OF },
    });

    return records.map((record) => ({
      childInstitutionId: record.targetInstitutionId,
      parentInstitutionId: record.sourceInstitutionId,
    }));
  }
}
