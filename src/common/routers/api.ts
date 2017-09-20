import { Props as WikiProps, Params as WikiParams } from "../pages/wiki";
import { State as AboutState } from "../pages/about";
import { AnyRoute, Route, newRoute } from "./route";

export const index: Route = newRoute({
  path: "/",
  endpoint: () => import(/* webpackChunkName: "pages/home" */ "../pages/home"),
  chunkName: "pages/home"
});

export const about: Route<void, AboutState> = newRoute({
  path: "/about",
  endpoint: () =>
    import(/* webpackChunkName: "pages/about" */ "../pages/about"),
  chunkName: "pages/about"
});

export const wiki: Route<WikiProps, void, WikiParams> = newRoute({
  path: "/wiki/:title",
  endpoint: () => import(/* webpackChunkName: "pages/wiki" */ "../pages/wiki"),
  chunkName: "pages/wiki"
});

export const styleGuide: Route = newRoute({
  path: "/dev/style-guide",
  endpoint: () =>
    import(/* webpackChunkName: "pages/style-guide" */ "../pages/style-guide"),
  chunkName: "pages/style-guide"
});

export const notFound: Route = newRoute({
  // `(.*)` is the new `*`. See
  // https://github.com/pillarjs/path-to-regexp/issues/37.
  path: "(.*)",
  endpoint: () =>
    import(/* webpackChunkName: "pages/not-found" */ "../pages/not-found"),
  chunkName: "pages/not-found",
  status: 404
});

export const routes: AnyRoute[] = [index, about, wiki, styleGuide, notFound];
