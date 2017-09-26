import * as assert from "assert";
import * as fetch from "node-fetch";
import { pageSummaryReviver } from "../models/page";
import { unmarshalPageSummary } from "./page-unmarshaller";

const HEADERS = new fetch.Headers();
HEADERS.append("etag", "802006980/4f754377-a235-11e7-a776-efb84f18649a");

describe("page-unmarshaller", () => {
  it("unmarshalPageSummary() unmarshals", () => {
    const input = require("./page-restbase-mount-everest-input.test.json");
    const result = unmarshalPageSummary({ headers: HEADERS, json: input });
    const expected = JSON.parse(
      JSON.stringify(
        require("./page-restbase-mount-everest-expected.test.json")
      ),
      pageSummaryReviver
    );
    assert.deepEqual(result, expected);
  });
});
