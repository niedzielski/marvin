import * as assert from "assert";
import Page from "../../../../src/server/components/Page";
import { render } from "preact-render-to-string";

describe("page()", () => {
  it("corporeal", () => {
    const vNode = Page({ title: "Test", manifest: "", children: ["body"] });
    assert.ok(render(vNode).includes('<div id="root">body</div>'));
  });

  it("incorporeal", () => {
    const vNode = Page({ title: "Test", manifest: "" });
    assert.ok(render(vNode).includes("<title>Test - Marvin</title>"));
  });
});
