import * as assert from "assert";
import { pageSummaryReviver } from "../models/page";
import { unmarshalPageSummary } from "./page-unmarshaller";

describe("page-unmarshaller", () => {
  it("unmarshalPageSummary() unmarshals", () => {
    const input = require("./page-restbase-mount-everest-input.test.json");
    const result = unmarshalPageSummary(input);
    const expected = JSON.parse(
      JSON.stringify(
        require("./page-restbase-mount-everest-expected.test.json")
      ),
      pageSummaryReviver
    );
    assert.deepEqual(result, expected);
  });
});
