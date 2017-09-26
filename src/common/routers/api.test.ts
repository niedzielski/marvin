import * as assert from "assert";
import { home, about, summary, styleGuide, notFound } from "./api";
import { Route, RouteParams } from "./route";

const testPathParams = <Params extends RouteParams | void, Props>({
  name,
  route,
  params
}: {
  name: string;
  route: Route<Params, Props>;
  params: Params;
}) =>
  it(name, () => {
    const url = route.url(params);
    const [, ...paramValues] = route.pathRe.exec(url) || [];
    assert.ok(
      route.paramNames.length ===
        Object.keys((params as RouteParams) || {}).length
    );
    route.paramNames.forEach((key, index) => {
      const expected = encodeURIComponent((params as RouteParams)[key.name]);
      const actual = paramValues[index];
      assert.deepStrictEqual(
        actual,
        expected,
        `${key.name} value differs. Expected: ${expected}; actual: ${actual}.`
      );
    });
  });

describe("api", () => {
  // eslint-disable-next-line max-len
  describe("each route's path, URL parameters, and route parameters match:", () => {
    [
      { name: "home", route: home, params: undefined },
      { name: "about", route: about, params: undefined },
      { name: "summary", route: summary, params: { title: "title" } },
      { name: "styleGuide", route: styleGuide, params: undefined },
      { name: "notFound", route: notFound, params: { 0: "/404" } }
    ].forEach(testPathParams);
  });
});
