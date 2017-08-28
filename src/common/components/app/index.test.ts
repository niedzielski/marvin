import * as assert from "assert";
import app from "./index";
import { render } from "preact-render-to-string";

describe("app()", () => {
  it("salutes you", () => {
    const html = render(app());
    assert.ok(html.indexOf("About") !== -1, "App HTML contains an about");
  });
});
