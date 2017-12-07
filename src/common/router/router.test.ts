import * as assert from "assert";

// Import the module statically to avoid potential timeouts in CI for a dynamic
// import, given ts-node compiles files when required (inside the test if using
// a dynamic import)
// @ts-ignore
import * as HomeModule from "../pages/home";
import { RedirectError, ClientError } from "../http/fetch";

import { newRoute } from "./route";
import { newRouter } from "./router";

function requestPageModule() {
  return Promise.resolve({ default: { Component: () => null } });
}

const routes = [newRoute({ path: "/", page: "home" })];

describe("router()", () => {
  describe(".route()", () => {
    it("passes route page name to requestPageModule()", () => {
      function requestPageModule(page: string) {
        assert.deepEqual(page, "home");
        return Promise.resolve({ default: { Component: () => null } });
      }

      return newRouter(routes, requestPageModule).route("/");
    });

    it("resolves a known route", () => {
      return newRouter(routes, requestPageModule)
        .route("/")
        .then(rsp => {
          assert.deepEqual(rsp.status, 200);
        });
    });

    it("resolves an unknown route as a 404", () => {
      return newRouter(routes, requestPageModule)
        .route("/404")
        .then(res => {
          assert.deepEqual(res.status, 404);
          assert.deepEqual(res.props.path, "/404");
        });
    });

    it("throws redirect errors up for handling by the server or client", () => {
      // Page module that throws a redirect
      const module = {
        default: {
          getInitialProps(): Promise<never> {
            throw new RedirectError(301, "/redirected-url");
          },
          Component: () => null
        }
      };

      const routes = [newRoute({ path: "/redirect", page: "redirect" })];

      return newRouter(routes, () => Promise.resolve(module))
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

    it("resolves a 404 error in getInitialProps() as a 404 page", () => {
      const module = {
        default: {
          getInitialProps(): Promise<never> {
            throw new ClientError(404, "/wiki/Nonexistent_title");
          },
          Component: () => null
        }
      };

      const routes = [newRoute({ path: "/wiki/:title", page: "wiki" })];

      return newRouter(routes, () => Promise.resolve(module))
        .route("/wiki/Nonexistent_title")
        .then(rsp => {
          assert.deepEqual(rsp.status, 404);
          assert.deepEqual(rsp.props.path, "/wiki/Nonexistent_title");
        });
    });

    // eslint-disable-next-line max-len
    it("resolves an unexpected error in getInitialProps() as an error page and prints an error to stderr", () => {
      const module = {
        default: {
          getInitialProps(): Promise<never> {
            throw new ClientError(500, "/page/summary/500");
          },
          Component: () => null
        }
      };

      const routes = [
        newRoute({ path: "/page/summary/:title", page: "summary" })
      ];

      return newRouter(routes, () => Promise.resolve(module))
        .route("/page/summary/500")
        .then(rsp => {
          assert.deepEqual(rsp.status, 500);
        });
    });
  });
});
