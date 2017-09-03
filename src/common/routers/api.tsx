import { Route } from "./route";

export const api: { [name: string]: Route } = {
  index: {
    path: "/",
    response: () =>
      import(/* webpackChunkName: "components/pages/index" */
      "../components/pages/index"),
    status: 200
  },
  about: {
    path: "/about",
    response: () =>
      import(/* webpackChunkName: "components/pages/about" */
      "../components/pages/about"),
    status: 200
  },
  notFound: {
    path: "*",
    response: () =>
      import(/* webpackChunkName: "components/pages/not-found" */
      "../components/pages/not-found"),
    status: 404
  }
};
