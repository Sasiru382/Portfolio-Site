const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
if (configuredBasePath && !/^\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(configuredBasePath)) {
  throw new Error("NEXT_PUBLIC_BASE_PATH must be empty or a slash-prefixed path without a trailing slash");
}
export const basePath = configuredBasePath;
/** Prefix local absolute URLs exactly once; leave external and fragment URLs intact. */
export function sitePath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//") || !basePath) return path;
  if (path === basePath || path.startsWith(`${basePath}/`) || path.startsWith(`${basePath}#`) || path.startsWith(`${basePath}?`)) return path;
  return `${basePath}${path}`;
}
