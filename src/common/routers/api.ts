import { Params as NotFoundParams } from "../pages/not-found";
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

export const wiki: Route<WikiParams, WikiProps> = newRoute({
  path: "/wiki/:title/:revision?",
  importModule: () =>
    import(/* webpackChunkName: "pages/wiki" */ "../pages/wiki"),
  chunkName: "pages/wiki"
});

export const summary: Route<SummaryParams, SummaryProps> = newRoute({
  path: "/page/summary/:title",
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

export const notFound: Route<NotFoundParams> = newRoute({
  // `(.*)` is the new `*`. See
  // https://github.com/pillarjs/path-to-regexp/issues/37.
  path: "(.*)",
  importModule: () =>
    import(/* webpackChunkName: "pages/not-found" */ "../pages/not-found"),
  chunkName: "pages/not-found",
  status: 404
});

export const routes: AnyRoute[] = [
  home,
  about,
  wiki,
  summary,
  randomWiki,
  randomSummary,
  styleGuide,
  notFound
];
