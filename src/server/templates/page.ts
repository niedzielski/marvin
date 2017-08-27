import { Manifest, index, style } from "../assets/manifest";

export interface PageParams {
  // Title of the page
  title: string,
  // HTML to render in the body of the page
  body: string,
  manifest: Manifest
}

export default function page({
  title,
  body = "",
  manifest
}: PageParams): string {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <link rel="stylesheet" href="${style(manifest)}" />
    <title>${title ? `${title} - ` : ""}Marvin</title>
  </head>
  <body>
    <div id="root">${body}</div>
    <script type="text/javascript" src="${index(manifest)}"></script>
  </body>
</html>`;
}
