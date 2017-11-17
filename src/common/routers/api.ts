import { Props as WikiProps, Params as WikiParams } from "../pages/wiki";
import {
  Props as SummaryProps,
  Params as SummaryParams
} from "../pages/summary";
import { AnyRoute, NoParamsRoute, Route, newRoute } from "./route";

export const home: NoParamsRoute = newRoute({
  path: "/",
  importModule: () =>
    import(/* webpackChunkName: "pages/home" */ "../pages/home"),
  chunkName: "pages/home"
});

export const about: NoParamsRoute = newRoute({
  path: "/about",
  importModule: () =>
    import(/* webpackChunkName: "pages/about" */ "../pages/about"),
  chunkName: "pages/about"
});

const TITLE_CHARACTER_REGEX_STRING =
  "[ %!\"$&'\\(\\)*,\\-.\\/0-9:;=@A-Z\\\\^_`a-z~\\x80-\\xFF+]";

export const wiki: Route<WikiParams, WikiProps> = newRoute({
  // https://www.mediawiki.org/wiki/Manual:$wgLegalTitleChars
  // https://en.wikipedia.org/w/api.php?action=query&meta=siteinfo
  path: `/wiki/:title(${TITLE_CHARACTER_REGEX_STRING}+?)/:revision(\\d+)?`, // eslint-disable-line max-len
  importModule: () =>
    import(/* webpackChunkName: "pages/wiki" */ "../pages/wiki"),
  chunkName: "pages/wiki"
});

export const summary: Route<SummaryParams, SummaryProps> = newRoute({
  // Note: title is specified as non-greedy here only to omit a trailing slash
  //       from the title as the wiki endpoint does.
  path: `/page/summary/:title(${TITLE_CHARACTER_REGEX_STRING}+?)`,
  importModule: () =>
    import(/* webpackChunkName: "pages/summary" */ "../pages/summary"),
  chunkName: "pages/summary"
});

export const randomWiki: NoParamsRoute<WikiProps> = newRoute({
  path: "/random/wiki",
  importModule: () => wiki.importModule(),
  chunkName: wiki.chunkName
}) as NoParamsRoute<WikiProps>;

export const randomSummary: NoParamsRoute<SummaryProps> = newRoute({
  path: "/random/summary",
  importModule: () => summary.importModule(),
  chunkName: summary.chunkName
}) as NoParamsRoute<SummaryProps>;

export const styleGuide: NoParamsRoute = newRoute({
  path: "/dev/style-guide",
  importModule: () =>
    import(/* webpackChunkName: "pages/style-guide" */ "../pages/style-guide"),
  chunkName: "pages/style-guide"
});

export const routes: AnyRoute[] = [
  home,
  about,
  wiki,
  summary,
  randomWiki,
  randomSummary,
  styleGuide
];
