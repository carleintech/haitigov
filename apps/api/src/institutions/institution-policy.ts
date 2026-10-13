import { type InstitutionRelationshipType, institutionIdSchema } from "@haitigov/contracts";

export class InstitutionPolicyError extends Error {
  constructor(
    readonly code: "INVALID_CANONICAL_ID" | "RELATIONSHIP_CYCLE" | "SELF_RELATIONSHIP",
    message: string,
  ) {
    super(message);
    this.name = "InstitutionPolicyError";
  }
}

export interface ParentRelationshipEdge {
  readonly childInstitutionId: string;
  readonly parentInstitutionId: string;
}

export function assertCanonicalInstitutionId(value: string): void {
  const result = institutionIdSchema.safeParse(value);
  if (!result.success) {
    throw new InstitutionPolicyError(
      "INVALID_CANONICAL_ID",
      result.error.issues[0]?.message ?? "Invalid institution ID.",
    );
  }
}

export function assertRelationshipAllowed(
  sourceInstitutionId: string,
  targetInstitutionId: string,
  relationshipType: InstitutionRelationshipType,
  parentEdges: readonly ParentRelationshipEdge[],
): void {
  assertCanonicalInstitutionId(sourceInstitutionId);
  assertCanonicalInstitutionId(targetInstitutionId);

  if (sourceInstitutionId === targetInstitutionId) {
    throw new InstitutionPolicyError(
      "SELF_RELATIONSHIP",
      "An institution cannot have a relationship with itself.",
    );
  }

  if (relationshipType !== "PARENT_OF") {
    return;
  }

  const childrenByParent = new Map<string, string[]>();
  for (const edge of parentEdges) {
    const children = childrenByParent.get(edge.parentInstitutionId) ?? [];
    children.push(edge.childInstitutionId);
    childrenByParent.set(edge.parentInstitutionId, children);
  }

  const pending = [targetInstitutionId];
  const visited = new Set<string>();
  while (pending.length > 0) {
    const current = pending.pop();
    if (current === undefined || visited.has(current)) {
      continue;
    }
    if (current === sourceInstitutionId) {
      throw new InstitutionPolicyError(
        "RELATIONSHIP_CYCLE",
        "The parent relationship would create a cycle.",
      );
    }

    visited.add(current);
    pending.push(...(childrenByParent.get(current) ?? []));
  }
}
