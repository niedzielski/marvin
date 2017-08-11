export interface AssetsManifest {
  [entrypoint: string]: {
    [format: string]: string;
  };
}

export interface PageParams {
  // Title of the page
  title: string;
  // HTML to render in the body of the page
  body: string;
  // Manifest of filename entry points to bundled assets.
  assets: AssetsManifest;
}

export default function page({ title, body = "", assets }: PageParams): string {
  const scripts = [];
  assets.index && assets.index.js && scripts.push(assets.index.js);

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>${title ? `${title} - ` : ""}Marvin</title>
  </head>
  <body>
    <div id="root">${body}</div>
    ${scripts.map(s => `<script type="text/javascript" src="./${s}"></script>`)}
  </body>
</html>`;
}
