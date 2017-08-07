const assert = require("assert");
const { describe, it } = require("mocha");
const page = require("../../../src/server/templates/page");

describe("page()", () => {
  it("incorporeal", () => {
    const assets = { index: {} };
    assert.ok(page({ assets }));
  });
});
