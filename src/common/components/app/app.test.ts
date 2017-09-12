import * as assert from "assert";
import App from "./app";
import { render } from "preact-render-to-string";

describe("app()", () => {
  it("salutes you", () => {
    const html = render(App({}));
    assert.ok(html.indexOf("About") !== -1, "App HTML contains an about");
  });
});
