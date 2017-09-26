import { Props as WikiProps, Params as WikiParams } from "../pages/wiki";
import { AnyRoute, Route, newRoute } from "./route";

export const home: Route = newRoute({
  path: "/",
  importModule: () =>
    import(/* webpackChunkName: "pages/home" */ "../pages/home"),
  chunkName: "pages/home"
});

export const about: Route = newRoute({
  path: "/about",
  importModule: () =>
    import(/* webpackChunkName: "pages/about" */ "../pages/about"),
  chunkName: "pages/about"
});

export const wiki: Route<WikiParams, WikiProps> = newRoute({
  path: "/wiki/:title",
  importModule: () =>
    import(/* webpackChunkName: "pages/wiki" */ "../pages/wiki"),
  chunkName: "pages/wiki"
});

export const styleGuide: Route = newRoute({
  path: "/dev/style-guide",
  importModule: () =>
    import(/* webpackChunkName: "pages/style-guide" */ "../pages/style-guide"),
  chunkName: "pages/style-guide"
});

export const notFound: Route = newRoute({
  // `(.*)` is the new `*`. See
  // https://github.com/pillarjs/path-to-regexp/issues/37.
  path: "(.*)",
  importModule: () =>
    import(/* webpackChunkName: "pages/not-found" */ "../pages/not-found"),
  chunkName: "pages/not-found",
  status: 404
});

export const routes: AnyRoute[] = [home, about, wiki, styleGuide, notFound];
