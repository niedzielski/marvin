import { h } from "preact";
import { PRODUCTION } from "../../common/assets/config";
import { asset } from "../../common/assets/manifest";
import { ChildrenProps } from "../../common/components/preact-utils";
declare function __non_webpack_require__(name: string): any; // eslint-disable-line camelcase

export interface Props extends ChildrenProps {
  // Title of the page
  title: string;
  chunkName: string;
}

// The production asset manifest from the public build products or
// the webpack-dev-server URL (which has no manifest). The former doesn't exist
// at compilation time, so use a dynamic require to read it from the filesystem
// at run time in production builds.
const manifest = PRODUCTION
  ? __non_webpack_require__("../public/assets-manifest.json")
  : undefined;

export default function HTMLPage({
  title = "",
  chunkName,
  children
}: Props): JSX.Element {
  // Asset order matters.
  const assets = [
    asset("runtime", "js", manifest),
    asset("vendor", "js", manifest),
    asset("index", "js", manifest),
    asset(chunkName, "js", manifest)
  ];
  const style = asset("index", "css", manifest);
  const favicon = asset("favicon/wikipedia", "ico", manifest);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title ? `${title} - ` : ""}Marvin</title>
        {/* Preload the stylesheet before the scripts */}
        <link rel="preload" href={style} as="style" />
        <link rel="stylesheet" href={style} />
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
