export interface AssetsManifest {
  [entrypoint: string]: {
    [format: string]: string
  }
}

export interface PageParams {
  // Title of the page
  title: string,
  // HTML to render in the body of the page
  body: string,
  // Manifest of filename entry points to bundled assets.
  assets: AssetsManifest | string
}

/**
 * @return {!string} The path to the asset identified by entry and extension (e.g., index.js);
 *                   either a URL (development) or a filesystem path (production).
 */
const asset = (
  manifest: AssetsManifest | string,
  entry: string,
  extension: string
): string =>
  typeof manifest === "string"
    ? `${manifest}/${entry}.${extension}`
    : manifest[entry][extension];

export default function page({ title, body = "", assets }: PageParams): string {
  const script: string = asset(assets, "index", "js");
  const style: string = asset(assets, "index", "css");
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <link rel="stylesheet" href="${style}" />
    <title>${title ? `${title} - ` : ""}Marvin</title>
  </head>
  <body>
    <div id="root">${body}</div>
    <script type="text/javascript" src="${script}"></script>
  </body>
</html>`;
}
