import { h } from "preact";
import { asset, scripts, style } from "../../common/assets/manifest";
import { ChildrenProps } from "../../common/components/preact-utils";

export interface Props extends ChildrenProps {
  // Title of the page
  title: string;
  chunkName: string;
}

export default function HTMLPage({
  title = "",
  chunkName,
  children
}: Props): JSX.Element {
  const assets: string[] = scripts;
  assets.push(asset(chunkName, "js"));

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
        <link rel="shortcut icon" href={asset("favicon/wikipedia", "ico")} />
      </head>
      <body>
        <div id="root">{children}</div>
        {assets.map(path => <script type="text/javascript" src={path} defer />)}
      </body>
    </html>
  );
}
