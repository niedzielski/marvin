import * as assert from "assert";
import { render } from "preact-render-to-string";
import HTMLPage from "../../../src/server/components/html-page";

describe("HTMLPage()", () => {
  it("contains a root div with the children when rendered", () => {
    const vNode = HTMLPage({
      title: "Test",
      chunkName: "",
      ssrData: { forceSSR: false },
      children: ["body"]
    });
    const html = render(vNode);
    const expected = '<div id="root">body</div>';
    assert.ok(
      html.includes(expected),
      `Could not find \n\n${expected}\n\nin\n\n${html}`
    );
  });

  it("contains a <title/> when rendered", () => {
    const vNode = HTMLPage({
      title: "Test",
      chunkName: "",
      ssrData: { forceSSR: false }
    });
    const html = render(vNode);
    const expected = "<title>Test - Marvin</title>";
    assert.ok(
      html.includes(expected),
      `Could not find \n\n${expected}\n\nin\n\n${html}`
    );
  });
});
