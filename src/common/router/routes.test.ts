import * as assert from "assert";
import {
  home,
  about,
  wiki,
  summary,
  randomWiki,
  randomSummary,
  styleGuide
} from "./routes";
import { PathParams, Route, RouteParams, QueryParams } from "./route";

interface TestParams<Params extends Partial<RouteParams> | undefined> {
  name: string;
  route: Route<Params>;
  // The raw path. Only path-to-regexp knows how to construct a path from params
  // but escapes the inputs in the process. Since Route.toParams() is usually
  // passed an unescaped string, it's worth manually assembling an unescaped
  // path to test this scenario.
  path: string;
  params: Params;
}

function testPathParams({ name, route, path, params }: TestParams<any>) {
  it(`${name} path and route parameter types are in sync`, () => {
    const expected = {
      path: params && params.path ? {} as PathParams : undefined,
      query: params && params.query ? {} as QueryParams : undefined
    };
    if (params) {
      Object.keys(params.path || {}).forEach(name => {
        const value = params.path[name];
        if (expected.path) {
          expected.path[name] =
            value === undefined ? undefined : encodeURIComponent(value);
        }
      });

      Object.keys(params.query || {}).forEach(name => {
        const value = params.query[name];
        if (expected.query) {
          expected.query[name] =
            value === undefined ? undefined : encodeURIComponent(value);
        }
      });
    }

    const path = route.toPath(params);
    const result = route.toParams(path);
    assert.deepStrictEqual(result, expected);
  });

  it(`${name} unescaped path matches`, () => {
    const expected = {
      path: params && params.path ? {} as PathParams : undefined,
      query: params && params.query ? {} as QueryParams : undefined
    };
    if (params) {
      Object.keys(params.path || {}).forEach(name => {
        const value = params.path[name];
        if (expected.path) expected.path[name] = value;
      });

      Object.keys(params.query || {}).forEach(name => {
        const value = params.query[name];
        if (expected.query) expected.query[name] = value;
      });
    }

    const result = route.toParams(path);
    assert.deepStrictEqual(result, expected);
  });
}

describe("routes", () => {
  describe("each route's path and URL path parameters match:", () => {
    [
      // Note: these types are verified to be RouteParams but not verified
      //       to be their specific route's type.
      { name: "home", route: home, path: "/", params: undefined },
      { name: "about", route: about, path: "/about", params: undefined },
      {
        name: "wiki (title)",
        route: wiki,
        path: "/wiki/title",
        params: { path: { title: "title", revision: undefined } }
      },
      {
        name: "wiki (title, revision)",
        route: wiki,
        path: "/wiki/title/1",
        params: { path: { title: "title", revision: "1" } }
      },
      {
        name: "wiki (title with slash)",
        route: wiki,
        path: "/wiki/title/text",
        params: { path: { title: "title/text", revision: undefined } }
      },
      {
        name: "wiki (title with slash, revision)",
        route: wiki,
        path: "/wiki/title/text/123456789",
        params: { path: { title: "title/text", revision: "123456789" } }
      },
      {
        name: "wiki (title with trailing slash)",
        route: wiki,
        path: "/wiki/title/",
        params: { path: { title: "title", revision: undefined } }
      },
      {
        name: "wiki (title with trailing slash, revision)",
        route: wiki,
        path: "/wiki/title/123456789/",
        params: { path: { title: "title", revision: "123456789" } }
      },
      {
        name: "wiki (title with slash and trailing slash)",
        route: wiki,
        path: "/wiki/title/text/",
        params: { path: { title: "title/text", revision: undefined } }
      },
      {
        name: "wiki (title with slash and trailing slash, revision)",
        route: wiki,
        path: "/wiki/title/text/123456789/",
        params: { path: { title: "title/text", revision: "123456789" } }
      },
      {
        name: "wiki (title is a slash)",
        route: wiki,
        path: "/wiki//",
        params: { path: { title: "/", revision: undefined } }
      },
      {
        name: "wiki (title is a slash, revision)",
        route: wiki,
        path: "/wiki///123456789/",
        params: { path: { title: "/", revision: "123456789" } }
      },
      {
        name: "wiki (title is a question mark)",
        route: wiki,
        path: "/wiki/%3f",
        params: { path: { title: "%3f", revision: undefined } }
      },
      {
        name: "wiki (title is a question mark, revision)",
        route: wiki,
        path: "/wiki/%3f/123456789/",
        params: { path: { title: "%3f", revision: "123456789" } }
      },
      {
        name: "wiki (title with every supported character class)",
        route: wiki,
        path: "/wiki/ %!\"$&'()*,-./0:;=@A\\^_`a~\x80+",
        params: {
          path: {
            title: " %!\"$&'()*,-./0:;=@A\\^_`a~\x80+",
            revision: undefined
          }
        }
      },
      {
        name: "wiki (title with every supported character class, revision)",
        route: wiki,
        path: "/wiki/ %!\"$&'()*,-./0:;=@A\\^_`a~\x80+/123456789",
        params: {
          path: {
            title: " %!\"$&'()*,-./0:;=@A\\^_`a~\x80+",
            revision: "123456789"
          }
        }
      },
      {
        name: "summary (title)",
        route: summary,
        path: "/page/summary/title",
        params: { path: { title: "title" } }
      },
      {
        name: "summary (title with slash)",
        route: summary,
        path: "/page/summary/title/text",
        params: { path: { title: "title/text" } }
      },
      {
        name: "summary (title with trailing slash)",
        route: summary,
        path: "/page/summary/title/",
        params: { path: { title: "title" } }
      },
      {
        name: "summary (title is a slash)",
        route: summary,
        path: "/page/summary//",
        params: { path: { title: "/" } }
      },
      {
        name: "summary (title with slash and trailing slash)",
        route: summary,
        path: "/page/summary/title/text/",
        params: { path: { title: "title/text" } }
      },
      {
        name: "summary (title is a question mark)",
        route: summary,
        path: "/page/summary/%3f",
        params: { path: { title: "%3f" } }
      },
      {
        name: "summary (title with every supported character class)",
        route: summary,
        path: "/page/summary/ %!\"$&'()*,-./0:;=@A\\^_`a~\x80+",
        params: { path: { title: " %!\"$&'()*,-./0:;=@A\\^_`a~\x80+" } }
      },
      {
        name: "random (wiki)",
        route: randomWiki,
        path: "/random/wiki",
        params: undefined
      },
      {
        name: "random (summary)",
        route: randomSummary,
        path: "/random/summary",
        params: undefined
      },
      {
        name: "styleGuide",
        route: styleGuide,
        path: "/dev/style-guide",
        params: undefined
      }
    ].forEach(testPathParams);
  });

  describe("wiki", () => {
    it("a title with an illegal character fails", () =>
      assert.deepStrictEqual(wiki.toParams("/wiki/{title}"), undefined));

    it("a nonnumerical revision fails", () =>
      assert.deepStrictEqual(
        wiki.toParams("/wiki/title/{revision}"),
        undefined
      ));
  });
});
