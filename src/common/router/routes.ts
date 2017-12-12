import { Params as WikiParams } from "../pages/wiki";
import { Params as SummaryParams } from "../pages/summary";
import { NoParamsRoute, Route, newRoute } from "./route";

export const home: NoParamsRoute = newRoute({ path: "/", page: "home" });

export const about: NoParamsRoute = newRoute({ path: "/about", page: "about" });

// https://www.mediawiki.org/wiki/Manual:$wgLegalTitleChars
// https://en.wikipedia.org/w/api.php?action=query&meta=siteinfo
const TITLE_CHARACTER_REGEX_STRING =
  "[ %!\"$&'\\(\\)*,\\-.\\/0-9:;=@A-Z\\\\^_`a-z~\\x80-\\xFF+]";

export const wiki: Route<WikiParams> = newRoute({
  path: `/wiki/:title(${TITLE_CHARACTER_REGEX_STRING}+)`,
  page: "wiki"
});

export const summary: Route<SummaryParams> = newRoute({
  path: `/page/summary/:title(${TITLE_CHARACTER_REGEX_STRING}+)`,
  page: "summary"
});

export const randomWiki: NoParamsRoute = newRoute({
  path: "/random/wiki",
  page: "wiki"
});

export const randomSummary: NoParamsRoute = newRoute({
  path: "/random/summary",
  page: "summary"
});

export const styleGuide: NoParamsRoute = newRoute({
  path: "/dev/style-guide",
  page: "style-guide"
});

export const routes: Route<any>[] = [
  home,
  about,
  wiki,
  summary,
  randomWiki,
  randomSummary,
  styleGuide
];
