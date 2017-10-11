import * as assert from "assert";
import {
  home,
  about,
  wiki,
  summary,
  randomWiki,
  randomSummary,
  styleGuide,
  notFound
} from "./api";
import { Route, RouteParams } from "./route";

const testPathParams = <Params extends RouteParams | undefined, Props>({
  name,
  route,
  params
}: {
  name: string;
  route: Route<Params, Props>;
  params: Params;
}) =>
  it(name, () => {
    const expected: RouteParams = {};
    Object.keys((params as RouteParams) || {}).forEach(name => {
      const value = (params as RouteParams)[name];
      expected[name] =
        value === undefined ? undefined : encodeURIComponent(value);
    });

    const path = route.toPath(params);
    const result = route.toParams(path);
    assert.deepStrictEqual(result, expected);
  });

describe("api", () => {
  describe("each route's path and URL path parameters match:", () => {
    [
      { name: "home", route: home, params: undefined },
      { name: "about", route: about, params: undefined },
      {
        name: "wiki (latest)",
        route: wiki,
        params: { title: "title", revision: undefined }
      },
      {
        name: "wiki (revision)",
        route: wiki,
        params: { title: "title", revision: "1" }
      },
      { name: "summary", route: summary, params: { title: "title" } },
      { name: "random (wiki)", route: randomWiki, params: undefined },
      { name: "random (summary)", route: randomSummary, params: undefined },
      { name: "styleGuide", route: styleGuide, params: undefined },
      { name: "notFound", route: notFound, params: { 0: "/404" } }
    ].forEach(testPathParams);
  });
});
