import { Assets } from "assets-webpack-plugin";

/** Manifest of filename entry points to bundled assets. */
export type Manifest = Assets | string;

/**
 * @return The path to the asset identified by entry and extension (e.g.,
 *         index.js); either a URL (development) or a filesystem path
 *         (production).
 */
export const asset = (
  manifest: Manifest,
  entry: string,
  extension: string
): string =>
  typeof manifest === "string"
    ? `${manifest}/public/${entry}.${extension}`
    : manifest[entry][extension];

export const index = (manifest: Manifest): string =>
  asset(manifest, "index", "js");

export const style = (manifest: Manifest): string =>
  asset(manifest, "index", "css");
