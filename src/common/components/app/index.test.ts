/* eslint-env mocha */
import * as assert from "assert";
import app from "./index";

describe("app()", () => {
  it("salutes you", () => {
    const html = app();
    assert.ok(html.indexOf("Hello world") !== -1, "App HTML contains a hello");
  });
});
