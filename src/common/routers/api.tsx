import { Route } from "./route";

export const api: { [name: string]: Route } = {
  index: {
    path: "/",
    response: () => import("../components/pages/index"),
    status: 200
  },
  about: {
    path: "/about",
    response: () => import("../components/pages/about"),
    status: 200
  },
  notFound: {
    path: "*",
    response: () => import("../components/pages/not-found"),
    status: 404
  }
};
