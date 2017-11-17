import { PRODUCTION, WEBPACK_DEV_SERVER_URL } from "./config";
declare function __non_webpack_require__(name: string): any; // eslint-disable-line camelcase

// The production asset manifest from the public build products or
// the webpack-dev-server URL (which has no manifest). The former doesn't exist
// at compilation time, so use a dynamic require to read it from the filesystem
// at run time in production builds.
const manifest = PRODUCTION
  ? __non_webpack_require__("../public/assets-manifest.json")
  : WEBPACK_DEV_SERVER_URL;

/**
 * @return The path to the asset identified by entry and extension (e.g.,
 *         index.js); either a URL (development) or a filesystem path
 *         (production).
 */
export function asset(entry: string, extension: string): string {
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

export const runtime: string = asset("runtime", "js");
export const vendor: string = asset("vendor", "js");
export const index: string = asset("index", "js");
export const scripts: string[] = [runtime, vendor, index];

export const style: string = asset("index", "css");
