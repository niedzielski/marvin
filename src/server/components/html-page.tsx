import { h } from "preact";
import { PRODUCTION } from "../../common/assets/config";
import { asset } from "../../common/assets/manifest";
import { ChildrenProps } from "../../common/components/preact-utils";
import { SSRData } from "../../common/models/ssr-data";
declare function __non_webpack_require__(name: string): any; // eslint-disable-line camelcase

export interface Props extends ChildrenProps {
  // Title of the page
  title: string;
  // Chunk to preload on the HTML. May not be needed if the chunks are already
  // included, like the error pages
  chunkName?: string;
  ssrData: SSRData;
}

// The production asset manifest from the public build products or
// the webpack-dev-server URL (which has no manifest). The former doesn't exist
// at compilation time, so use a dynamic require to read it from the filesystem
// at run time in production builds.
const manifest = PRODUCTION
  ? __non_webpack_require__("../public/assets-manifest.json")
  : undefined;

export default function HTMLPage({
  title,
  chunkName,
  ssrData,
  children
}: Props): JSX.Element {
  // Asset order matters.
  const assets = [
    asset("runtime", "js", manifest),
    asset("vendor", "js", manifest),
    asset("index", "js", manifest)
  ];
  if (chunkName) assets.push(asset(chunkName, "js", manifest));

  const style = asset("index", "css", manifest);
  const favicon = asset("favicon/wikipedia", "ico", manifest);

  // Serialize the SSR data safely. See:
  // https://github.com/reactjs/redux/blob/cda8699/docs/recipes/ServerRendering.md#inject-initial-component-html-and-state
  const ssrDataString = JSON.stringify(ssrData).replace(/</g, "\\u003c");

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        {/* Preload the stylesheet before the scripts */}
        <link rel="preload" href={style} as="style" />
        <link rel="stylesheet" href={style} />
        {/* Set the global server-side rendered data before scripts execute. */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `window.__SSR_DATA__ = ${ssrDataString}`
          }}
        />
        {assets.map(path => <link rel="preload" href={path} as="script" />)}
        <link rel="shortcut icon" href={favicon} />
      </head>
      <body>
        <div id="root">{children}</div>
        {assets.map(path => <script type="text/javascript" src={path} defer />)}
      </body>
    </html>
  );
}
