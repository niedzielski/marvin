import * as assert from "assert";
import * as fetch from "node-fetch";
import { PageSummary, pageSummaryReviver } from "../models/page/summary";
import { unmarshalPageSummary } from "./page-unmarshaller";
import { RESTBase } from "./restbase";

const ETAG = "802006980/4f754377-a235-11e7-a776-efb84f18649a";
const HEADERS = new fetch.Headers();
HEADERS.append("etag", ETAG);

const NOW = new Date(Date.now()).toString();

describe("page-unmarshaller", () => {
  describe(".unmarshalPageSummary() unmarshals", () => {
    // eslint-disable-next-line max-len
    it("omits undefined properties and returns extract even when there are no paragraphs", () => {
      const json: RESTBase.PageSummary.PageSummary = {
        title: "title",
        displaytitle: "displaytitle",
        pageid: 1,
        extract: "extract",
        extract_html: "extract_html",
        lang: "en",
        dir: "ltr",
        timestamp: NOW,
        description: "description"
      };
      const expected: PageSummary = {
        pageID: 1,
        titleText: "title",
        titleHTML: "displaytitle",
        descriptionText: "description",
        lastModified: new Date(Date.parse(NOW)),
        etag: ETAG,
        wikiLanguageCode: "en",
        localeDirection: "ltr",
        extractText: "extract",
        extractHTML: ["extract_html"]
      };
      const input = { headers: HEADERS, json: json as {} };
      const actual = unmarshalPageSummary(input);
      assert.deepStrictEqual(actual, expected);
    });
  });

  it("unmarshalPageSummary() unmarshals a server response", () => {
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
