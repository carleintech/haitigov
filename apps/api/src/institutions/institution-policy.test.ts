import { describe, expect, it } from "vitest";

import {
  assertCanonicalInstitutionId,
  assertRelationshipAllowed,
  InstitutionPolicyError,
} from "./institution-policy.js";

describe("institution policy", () => {
  it.each(["HT-MIN-001", "HT-MEF-DGI", "HT-EXEC-002"])(
    "accepts canonical registry ID %s",
    (institutionId) => {
      expect(() => {
        assertCanonicalInstitutionId(institutionId);
      }).not.toThrow();
    },
  );

  it.each(["minister-name", "HT_mef", "MEF", "HT-"])(
    "rejects non-canonical ID %s",
    (institutionId) => {
      expect(() => {
        assertCanonicalInstitutionId(institutionId);
      }).toThrow(InstitutionPolicyError);
    },
  );

  it("rejects self-referential relationships", () => {
    expect(() => {
      assertRelationshipAllowed("HT-MIN-001", "HT-MIN-001", "RELATED_TO", []);
    }).toThrow(expect.objectContaining({ code: "SELF_RELATIONSHIP" }));
  });

  it("rejects parent relationships that create a cycle", () => {
    expect(() => {
      assertRelationshipAllowed("HT-MIN-003", "HT-MIN-001", "PARENT_OF", [
        { parentInstitutionId: "HT-MIN-001", childInstitutionId: "HT-MIN-002" },
        { parentInstitutionId: "HT-MIN-002", childInstitutionId: "HT-MIN-003" },
      ]);
    }).toThrow(expect.objectContaining({ code: "RELATIONSHIP_CYCLE" }));
  });

  it("allows a non-cyclic parent relationship", () => {
    expect(() => {
      assertRelationshipAllowed("HT-MIN-001", "HT-MIN-003", "PARENT_OF", [
        { parentInstitutionId: "HT-MIN-001", childInstitutionId: "HT-MIN-002" },
      ]);
    }).not.toThrow();
  });
});
