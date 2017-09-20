// Import the module statically to avoid potential timeouts in CI for a dynamic
// import, given ts-node compiles files when required (inside the test if using
// a dynamic import)
import * as HomeModule from "../pages/home";

import { newRoute } from "./route";
import { newRouter } from "./router";

const routes = [
  newRoute({
    path: "/",
    endpoint: () => Promise.resolve(HomeModule),
    chunkName: "components/pages/home"
  })
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
