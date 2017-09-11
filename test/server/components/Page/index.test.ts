import * as assert from "assert";
import Page from "../../../../src/server/components/Page";
import { render } from "preact-render-to-string";

describe("Page()", () => {
  it("contains a root div with the children when rendered", () => {
    const vNode = Page({
      title: "Test",
      manifest: "",
      chunkName: "",
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
    const vNode = Page({ title: "Test", manifest: "", chunkName: "" });
    const html = render(vNode);
    const expected = "<title>Test - Marvin</title>";
    assert.ok(
      html.includes(expected),
      `Could not find \n\n${expected}\n\nin\n\n${html}`
    );
  });
});
