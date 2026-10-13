import { describe, expect, it, vi } from "vitest";

import { PrismaInstitutionRepository } from "./institutions.repository.js";

describe("public institution repository", () => {
  it("lists only current or legacy verified records by default", async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const repository = new PrismaInstitutionRepository({
      client: { institution: { findMany } },
    } as never);

    await repository.findMany({ limit: 50 });

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          verificationStatus: {
            in: ["VERIFIED_CURRENT", "VERIFIED_LEGACY"],
          },
        },
      }),
    );
  });

  it("does not retrieve detail or provenance for unverified records", async () => {
    const findFirst = vi.fn().mockResolvedValue(null);
    const sourceFindMany = vi.fn();
    const verificationFindMany = vi.fn();
    const repository = new PrismaInstitutionRepository({
      client: {
        institution: { findFirst },
        sourceRecord: { findMany: sourceFindMany },
        verificationEvent: { findMany: verificationFindMany },
      },
    } as never);

    await repository.findById("HT-TEST-001");

    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "HT-TEST-001",
          verificationStatus: {
            in: ["VERIFIED_CURRENT", "VERIFIED_LEGACY"],
          },
        },
      }),
    );
    expect(sourceFindMany).not.toHaveBeenCalled();
    expect(verificationFindMany).not.toHaveBeenCalled();
  });
});
