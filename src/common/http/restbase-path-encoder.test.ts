import * as assert from "assert";
import reencodePathSegment from "./restbase-path-encoder";

describe("restbase-path-encoder", () => {
  describe(".reencodePathSegment()", () => {
    it("encodes slashes and nothing else", () => {
      assert.deepStrictEqual(reencodePathSegment("path/path"), "path%2fpath");
    });

    it("doesn't reencode already encoded slashes", () => {
      assert.deepStrictEqual(reencodePathSegment("%2f"), "%2f");
    });
  });
});
