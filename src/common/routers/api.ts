import { Route } from "./route";
import { Props as WikiProps } from "../pages/wiki";

export const index: Route<void, void> = {
  path: "/",
  endpoint: () =>
    import(/* webpackChunkName: "pages/index" */ "../pages/index"),
  chunkName: "pages/index",
  status: 200
};

export const about: Route<void, void> = {
  path: "/about",
  endpoint: () =>
    import(/* webpackChunkName: "pages/about" */ "../pages/about"),
  chunkName: "pages/about",
  status: 200
};

export const wiki: Route<WikiProps, void> = {
  path: "/wiki/:title",
  endpoint: () => import(/* webpackChunkName: "pages/wiki" */ "../pages/wiki"),
  chunkName: "pages/wiki",
  status: 200
};

export const styleGuide: Route<void, void> = {
  path: "/dev/style-guide",
  endpoint: () =>
    import(/* webpackChunkName: "pages/style-guide" */ "../pages/style-guide"),
  chunkName: "pages/style-guide",
  status: 200
};

export const notFound: Route<void, void> = {
  // `(.*)` is the new `*`. See
  // https://github.com/pillarjs/path-to-regexp/issues/37.
  path: "(.*)",
  endpoint: () =>
    import(/* webpackChunkName: "pages/not-found" */ "../pages/not-found"),
  chunkName: "pages/not-found",
  status: 404
};

export const routes: Route<any, any>[] = [
  index,
  about,
  wiki,
  styleGuide,
  notFound
];
