import { Assets } from "assets-webpack-plugin";
import { PRODUCTION, WEBPACK_DEV_SERVER_URL } from "../../common/assets/config";

/**
 * @return The path to the asset identified by entry and extension (e.g.,
 *         index.js); either a URL (development) or a filesystem path
 *         (production).
 */
export function asset(
  entry: string,
  extension: string,
  manifest?: Assets
): string {
  if (manifest && manifest[entry] && manifest[entry][extension])
    // When the manifest is present and the entry exists, just return its path.
    return manifest[entry][extension];

  // When the manifest or entry doesn't exist, use the public path which points
  // to a static file. For prod, files are copied from src/public. For dev,
  // all assets are unhashed and served from /public/.
  const baseURL = PRODUCTION ? "" : WEBPACK_DEV_SERVER_URL;
  return `${baseURL}/public/${entry}.${extension}`;
}
