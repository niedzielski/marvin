import * as assert from "assert";

// Import the module statically to avoid potential timeouts in CI for a dynamic
// import, given ts-node compiles files when required (inside the test if using
// a dynamic import)
// @ts-ignore
import * as HomeModule from "../pages/home";
import { RedirectError } from "../http/fetch";

import { newRoute } from "./route";
import { newRouter } from "./router";

const routes = [newRoute({ path: "/", page: "home" })];

describe("router()", () => {
  describe(".route()", () => {
    it("a known route is resolved", () => {
      return newRouter(routes)
        .route("/")
        .then(rsp => {
          assert.deepEqual(rsp.status, 200);
        });
    });

    it("an unknown route resolves with the path and appropriate status", () => {
      return newRouter(routes)
        .route("/404")
        .then(res => {
          assert.deepEqual(res.status, 404);
          assert.deepEqual(res.props.path, "/404");
        });
    });

    // eslint-disable-next-line max-len
    it("throws redirect errors up for handling on the server/client environment", () => {
      // Page module that throws a redirect
      const module = {
        default: {
          getInitialProps(): Promise<never> {
            throw new RedirectError(301, "/redirected-url");
          },
          Component: () => null
        }
      };

      const requestPageModule = (page: string) =>
        page === "redirect"
          ? Promise.resolve(module)
          : Promise.reject(new Error("No page found"));

      const routes = [newRoute({ path: "/redirect", page: "redirect" })];

      return newRouter(routes, requestPageModule)
        .route("/redirect")
        .catch(err => {
          assert.ok(
            err instanceof RedirectError,
            "Error is a redirect error on redirect"
          );
          assert.deepEqual(err.status, 301);
          assert.deepEqual(err.url, "/redirected-url");
        });
    });
  });
});
