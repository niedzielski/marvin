import * as assert from "assert";
import page from "../../../src/server/templates/page";

describe("page()", () => {
  it("incorporeal", () => {
    assert.ok(page({ title: "Test", body: "Body", manifest: "" }));
  });
});
