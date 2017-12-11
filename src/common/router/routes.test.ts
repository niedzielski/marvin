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
import { Route, RouteParams, PathParams, QueryParams } from "./route";

interface TestParams<Params extends Partial<RouteParams> | undefined> {
  name: string;
  route: Route<Params>;
  // The raw path. Only path-to-regexp knows how to construct a path from params
  // but escapes the inputs in the process. Since Route.toParams() is usually
  // passed an unescaped string, it's worth manually assembling an unescaped
  // path to test this scenario.
  path: string;
  query?: string;
  params: Params;
}

function testParams({ name, route, path, query, params }: TestParams<any>) {
  it(`${name} path and route parameter types are in sync`, () => {
    const expected: Partial<RouteParams> = {
      path: undefined,
      query: undefined
    };
    if (params && params.path) {
      expected.path = {};
      Object.keys(params.path).forEach(name => {
        const param = params.path[name];
        (expected.path as PathParams)[name] =
          param === undefined ? undefined : encodeURIComponent(param);
      });
    }
    if (params && params.query) {
      // query-string objects do not have a prototype.
      expected.query = Object.create(null);
      Object.keys(params.query).forEach(name => {
        const param = params.query[name];
        (expected.query as QueryParams)[name] =
          param === undefined ? undefined : encodeURIComponent(param);
      });
    }

    const path = route.toPath(params);
    const query = route.toQuery(params);
    const result = route.toParams(path, `?${query}`);
    assert.deepStrictEqual(result, expected);
  });

  it(`${name} unescaped path matches`, () => {
    const expected = { path: undefined, query: undefined, ...params };
    if (expected.query) {
      // query-string objects do not have a prototype.
      expected.query = Object.assign(Object.create(null), expected.query);
    }

    const result = route.toParams(path, query ? `?${query}` : "");
    assert.deepStrictEqual(result, expected);
  });
}

describe("routes", () => {
  describe("each route's path and URL path parameters match:", () => {
    [
      // Note: these types are verified to be RouteParams but not verified
      //       to be their specific route's type.
      { name: "home", route: home, path: "/", params: undefined },
      {
        name: "home (global route parameters)",
        route: home,
        path: "/",
        query: "query=param",
        params: { path: undefined, query: { query: "param" } }
      },
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
    ].forEach(testParams);
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
