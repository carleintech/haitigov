import { readFileSync } from "node:fs";

import { createDatabaseClient } from "../packages/database/dist/src/client.js";

const databaseUrl =
  process.env.DATABASE_URL ?? readFileSync(".env", "utf8").match(/^DATABASE_URL=(.+)$/m)?.[1];
const prisma = createDatabaseClient(databaseUrl);

try {
  const candidates = await prisma.serviceCatalogEntry.findMany({
    orderBy: { id: "asc" },
    where: { verificationStatus: "PENDING_REVIEW" },
  });

  const records = await prisma.sourceRecord.findMany({
    orderBy: { subjectId: "asc" },
    where: {
      subjectType: "SERVICE",
      subjectId: { in: candidates.map((candidate) => candidate.id) },
    },
  });
  const sourceBySubject = new Map(records.map((record) => [record.subjectId, record]));

  console.log(
    JSON.stringify(
      candidates.map((candidate) => ({
        id: candidate.id,
        locale: candidate.locale,
        name: candidate.name,
        sourceUrl: sourceBySubject.get(candidate.id)?.sourceUrl ?? null,
        status: candidate.status,
        verificationStatus: candidate.verificationStatus,
      })),
      null,
      2,
    ),
  );
} finally {
  await prisma.$disconnect();
}
