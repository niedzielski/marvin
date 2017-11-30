import * as assert from "assert";

// Import the module statically to avoid potential timeouts in CI for a dynamic
// import, given ts-node compiles files when required (inside the test if using
// a dynamic import)
import * as HomeModule from "../pages/home";
import { RedirectError } from "../http/fetch";

import { newRoute } from "./route";
import { newRouter } from "./router";

const routes = [
  newRoute({
    path: "/",
    importModule: () => Promise.resolve(HomeModule),
    chunkName: "components/pages/home"
  })
];

describe("router()", () => {
  describe(".route()", () => {
    it("a known route is resolved", done => {
      newRouter(routes)
        .route("/")
        .then(() => done());
    });

    // eslint-disable-next-line max-len
    it("an unknown route resolves with the path and appropriate status", done => {
      newRouter(routes)
        .route("/404")
        .then(res => {
          assert.equal(res.status, 404);
          assert.equal(res.props.path, "/404");
          done();
        });
    });

    // eslint-disable-next-line max-len
    it("throws redirect errors up for handling on the server/client environment", done => {
      newRouter([
        newRoute({
          path: "/redirect",
          importModule: () =>
            Promise.resolve({
              default: {
                getInitialProps() {
                  // Trick TS and eslint for tests
                  if ((_ => true)())
                    throw new RedirectError(301, "/redirected-url");
                  return Promise.reject("Doesn't matter");
                },
                Component: () => null
              }
            }),
          chunkName: "doesnotmatter"
        })
      ])
        .route("/redirect")
        .catch(err => {
          assert.ok(
            err instanceof RedirectError,
            "Error is a redirect error on redirect"
          );
          assert.equal(err.status, 301);
          assert.equal(err.url, "/redirected-url");
          done();
        });
    });
  });
});
