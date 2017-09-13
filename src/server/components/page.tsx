import { Manifest, asset, scripts, style } from "../assets/manifest";
import { Children } from "../../common/types/preact";
import { h } from "preact";

export interface Props {
  // Title of the page
  title: string;
  manifest: Manifest;
  chunkName: string;
  // HTML to render in the body of the page
  children?: Children;
}

export function Page({
  title = "",
  manifest,
  chunkName,
  children
}: Props): JSX.Element {
  const assets: string[] = scripts(manifest);
  assets.push(asset({ manifest, entry: chunkName, extension: "js" }));
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{title ? `${title} - ` : ""}Marvin</title>
        <base href="/" />
        <link rel="stylesheet" href={style(manifest)} />
        {assets.map(path => (
          <link rel="preload" href={path} {...{ as: "script" }} />
        ))}
      </head>
      <body>
        <div id="root">{children}</div>
        {assets.map(path => <script type="text/javascript" src={path} />)}
      </body>
    </html>
  );
}
