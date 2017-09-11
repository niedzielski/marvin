import { Assets } from "assets-webpack-plugin";

/** Manifest of filename entry points to bundled asset paths. */
export type Manifest = Assets | string;

export interface AssetParameters {
  manifest: Manifest,
  entry: string,
  extension: string
}

/**
 * @return The path to the asset identified by entry and extension (e.g.,
 *         index.js); either a URL (development) or a filesystem path
 *         (production).
 */
export const asset = ({
  manifest,
  entry,
  extension
}: AssetParameters): string =>
  typeof manifest === "string"
    ? `${manifest}/public/${entry}.${extension}`
    : manifest[entry][extension];

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

export const runtime = (manifest: Manifest): string =>
  asset({ manifest, entry: "runtime", extension: "js" });

export const vendor = (manifest: Manifest): string =>
  asset({ manifest, entry: "vendor", extension: "js" });

export const index = (manifest: Manifest): string =>
  asset({ manifest, entry: "index", extension: "js" });

export const scripts = (manifest: Manifest): string[] => [
  runtime(manifest),
  vendor(manifest),
  index(manifest)
];

export const style = (manifest: Manifest): string =>
  asset({ manifest, entry: "index", extension: "css" });
