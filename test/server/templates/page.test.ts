import * as assert from "assert";
import page from "../../../src/server/templates/page";

describe("page()", () => {
  it("incorporeal", () => {
    const assets = { index: { js: "index.js" } };
    assert.ok(page({ title: "Test", body: "Body", assets }));
  });
});
