export function createPublicApiUrl(apiBaseUrl: string, path: string): URL | null {
  try {
    const base = new URL(apiBaseUrl);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(base.hostname);
    if (
      base.username ||
      base.password ||
      base.search ||
      base.hash ||
      (base.protocol !== "https:" && !(base.protocol === "http:" && local))
    ) {
      return null;
    }

    return new URL(`${base.toString().replace(/\/$/, "")}/${path.replace(/^\//, "")}`);
  } catch {
    return null;
  }
}

export const publicApiRequestOptions = {
  cache: "no-store",
  headers: { Accept: "application/json" },
  redirect: "error",
} as const;
