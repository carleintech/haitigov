import { describe, expect, it, vi } from "vitest";

import { PrismaPublicServiceRepository } from "./services.repository.js";

describe("public service repository", () => {
  it("hard-filters to published and currently verified records", async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const database = { client: { serviceCatalogEntry: { findMany } } };
    const repository = new PrismaPublicServiceRepository(database as never);

    await repository.findMany({ locale: "ht" });

    expect(findMany).toHaveBeenCalledWith({
      orderBy: { id: "asc" },
      take: 101,
      where: {
        status: "PUBLISHED",
        verificationStatus: "VERIFIED_CURRENT",
      },
    });
  });
});
