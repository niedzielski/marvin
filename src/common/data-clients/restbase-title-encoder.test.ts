import * as assert from "assert";
import reencodeRESTBaseTitlePath from "./restbase-title-encoder";

describe("restbase-title-encoder", () => {
  describe(".reencodeRESTBaseTitlePath()", () => {
    it("encodes slashes and nothing else", () => {
      assert.deepStrictEqual(
        reencodeRESTBaseTitlePath("path/path"),
        "path%2fpath"
      );
    });

    it("doesn't reencode already encoded slashes", () => {
      assert.deepStrictEqual(reencodeRESTBaseTitlePath("%2f"), "%2f");
    });
  });
});
