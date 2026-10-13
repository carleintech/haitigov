import "dotenv/config";

import { createDatabaseClient } from "../src/client.js";
import { seedRegistry } from "./registry-import.js";
import { seedServiceCatalogCandidates } from "./service-catalog-import.js";

const classifications = [
  {
    code: "PUBLIC",
    name: "Public",
    description: "Approved for public disclosure.",
    rank: 10,
  },
  {
    code: "INTERNAL",
    name: "Internal",
    description: "Operational information not approved for public disclosure.",
    rank: 20,
  },
  {
    code: "CONFIDENTIAL",
    name: "Confidential",
    description: "Sensitive information requiring explicit access authorization.",
    rank: 30,
  },
  {
    code: "RESTRICTED",
    name: "Restricted",
    description: "Highly sensitive information subject to strict purpose and access controls.",
    rank: 40,
  },
] as const;

const prisma = createDatabaseClient();

try {
  for (const classification of classifications) {
    await prisma.dataClassification.upsert({
      where: { code: classification.code },
      create: classification,
      update: {
        name: classification.name,
        description: classification.description,
        rank: classification.rank,
      },
    });
  }

  await prisma.systemMetadata.upsert({
    where: { key: "data_foundation_version" },
    create: { key: "data_foundation_version", value: "1" },
    update: { value: "1" },
  });

  await seedRegistry(prisma);
  await seedServiceCatalogCandidates(prisma);
} finally {
  await prisma.$disconnect();
}
