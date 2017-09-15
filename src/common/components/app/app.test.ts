import * as assert from "assert";
import { render } from "preact-render-to-string";
import App from "./app";

describe("app()", () => {
  it("salutes you", () => {
    const html = render(App({}));
    assert.ok(html.indexOf("About") !== -1, "App HTML contains an about");
  });
});
