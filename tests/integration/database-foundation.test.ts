import { loadEnvFile } from "node:process";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createDatabaseClient, type PrismaClient } from "../../packages/database/src/index.ts";

describe("Phase 2 database foundation", () => {
  let database: PrismaClient;

  beforeAll(() => {
    if (!process.env.DATABASE_URL) {
      loadEnvFile(".env");
    }

    database = createDatabaseClient();
  });

  afterAll(async () => {
    await database.$disconnect();
  });

  it("has PostGIS enabled", async () => {
    const rows = await database.$queryRaw<Array<{ version: string }>>`
      SELECT PostGIS_Version() AS version
    `;

    expect(rows[0]?.version).toMatch(/^3\.5/);
  });

  it("has the deterministic platform classifications", async () => {
    await expect(database.dataClassification.count()).resolves.toBe(4);
  });

  it("has the Phase 2 registry, territory, provenance, verification, and audit tables", async () => {
    const requiredTables = [
      "audit_events",
      "communal_sections",
      "communes",
      "data_classifications",
      "departments",
      "institution_aliases",
      "institution_relationships",
      "institutions",
      "source_records",
      "sources",
      "verification_events",
    ];
    const rows = await database.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    const actualTables = new Set(rows.map((row) => row.table_name));

    for (const requiredTable of requiredTables) {
      expect(actualTables.has(requiredTable), `${requiredTable} should exist`).toBe(true);
    }
  });
});
