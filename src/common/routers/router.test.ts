import { newRouter } from "./router";

const routes = [
  {
    path: "/",
    endpoint: () => import("../pages/index"),
    chunkName: "components/pages/index",
    status: 200
  }
];

describe("router()", () => {
  describe(".route()", () => {
    it(`a known route is resolved`, done => {
      newRouter(routes)
        .route("/")
        .then(() => done());
    });

    it(`an unknown route is rejected`, done => {
      newRouter(routes)
        .route("/404")
        .catch(() => done());
    });
  });
});
