import { Route } from "./route";

export const index: Route<void, void> = {
  path: "/",
  endpoint: () =>
    import(/* webpackChunkName: "components/pages/index" */
    "../components/pages/index"),
  chunkName: "components/pages/index",
  status: 200
};

export const about: Route<void, void> = {
  path: "/about",
  endpoint: () =>
    import(/* webpackChunkName: "components/pages/about" */
    "../components/pages/about"),
  chunkName: "components/pages/about",
  status: 200
};

export const notFound: Route<void, void> = {
  path: "(.*)",
  endpoint: () =>
    import(/* webpackChunkName: "components/pages/not-found" */
    "../components/pages/not-found"),
  chunkName: "components/pages/not-found",
  status: 404
};

export const routes: Route<any, any>[] = [index, about, notFound];
