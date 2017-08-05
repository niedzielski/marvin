const assert = require("assert");
const mocha = require("mocha");
const page = require("../../../src/server/templates/page");

mocha.describe("page()", () => {
  mocha.it("incorporeal", () => {
    const assets = { index: {} };
    assert.ok(page({ assets }));
  });
});
