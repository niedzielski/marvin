import { Assets } from "assets-webpack-plugin";

/** Manifest of filename entry points to bundled asset paths. */
export type Manifest = Assets | string;

/**
 * @return The path to the asset identified by entry and extension (e.g.,
 *         index.js); either a URL (development) or a filesystem path
 *         (production).
 */
export function asset(
  manifest: Manifest,
  entry: string,
  extension: string
): string {
  if (typeof manifest === "string")
    // When the manifest is a string, it is the URL of something like
    // webpack-dev-server, so just point to there for the asset
    return `${manifest}/public/${entry}.${extension}`;
  else if (manifest[entry] && manifest[entry][extension])
    // When it is an object, if the entry exists, just return its path
    return manifest[entry][extension];
  else
    // If the entry is not on the asset manifest, then just point to it directly
    // to the static assets path (copied there as-is from src/public)
    return `/public/${entry}.${extension}`;
}

// Note: scripts must be included in the correct order: runtime, vendor, index.
// Example errors:
// - No runtime:
//
//   vendor.js:1 Uncaught ReferenceError: webpackJsonp is not defined
//       at vendor.js:1
//
// - No vendor:
//
//   Uncaught TypeError: Cannot read property 'call' of undefined
//       at __webpack_require__ (runtime.js:55)
//       at Object.0 (index.js:204)
//       at __webpack_require__ (runtime.js:55)
//       at webpackJsonpCallback (runtime.js:26)
//       at index.js:1

export function runtime(manifest: Manifest): string {
  return asset(manifest, "runtime", "js");
}

export function vendor(manifest: Manifest): string {
  return asset(manifest, "vendor", "js");
}

export function index(manifest: Manifest): string {
  return asset(manifest, "index", "js");
}

export function scripts(manifest: Manifest): string[] {
  return [runtime(manifest), vendor(manifest), index(manifest)];
}

export function style(manifest: Manifest): string {
  return asset(manifest, "index", "css");
}
