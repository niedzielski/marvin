import { Manifest, scripts, style } from "../../assets/manifest";
import { Children } from "../../../common/types/preact";
import { h } from "preact";

export interface PageParams {
  // Title of the page
  title: string,
  manifest: Manifest,
  // HTML to render in the body of the page
  children?: Children
}

export default function Page({
  title = "",
  manifest,
  children
}: PageParams): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={style(manifest)} />
        <title>{title ? `${title} - ` : ""}Marvin</title>
        {scripts(manifest).map(path => (
          <link rel="preload" href={path} {...{ as: "script" }} />
        ))}
      </head>
      <body>
        <div id="root">{children}</div>
        {scripts(manifest).map(script => (
          <script type="text/javascript" src={script} />
        ))}
      </body>
    </html>
  );
}
