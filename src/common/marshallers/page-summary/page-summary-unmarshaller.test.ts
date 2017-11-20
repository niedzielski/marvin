import * as assert from "assert";
import { PageSummary, pageSummaryReviver } from "../../models/page/summary";
import { PageImage } from "../../models/page/image";
import { RESTBase } from "../restbase";
import { EXPECTED_ETAG, HEADERS, reviveFile } from "../utils.test";
import {
  unmarshalPageImage,
  unmarshalPageSummary
} from "./page-summary-unmarshaller";

const NOW = new Date(Date.now()).toString();

describe("page-summary-unmarshaller", () => {
  describe(".unmarshalPageImage()", () => {
    [false, true].forEach(landscape => {
      it(`unmarshals ${landscape ? "landscape" : "portrait"}`, () => {
        const width = landscape ? 2 : 1;
        const height = landscape ? 1 : 2;
        const json: RESTBase.PageSummary.Image = {
          source: "source",
          width,
          height
        };
        const expected: PageImage = {
          url: "source",
          width,
          height,
          landscape
        };
        const result = unmarshalPageImage(json as {});
        assert.deepStrictEqual(result, expected);
      });
    });
  });

  describe(".unmarshalPageSummary()", () => {
    // eslint-disable-next-line max-len
    it("unmarshals omitting undefined properties and returns extract even when there are no paragraphs", () => {
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
        titleID: "titleID",
        titleText: "title",
        titleHTML: "displaytitle",
        descriptionText: "description",
        lastModified: new Date(Date.parse(NOW)),
        etag: EXPECTED_ETAG,
        wikiLanguageCode: "en",
        localeDirection: "ltr",
        extractText: "extract",
        extractHTML: ["extract_html"]
      };
      const result = unmarshalPageSummary({
        url: "titleID",
        headers: HEADERS,
        json: json as {}
      });
      assert.deepStrictEqual(result, expected);
    });

    it("unmarshals a server response", () => {
      const json = require("./page-summary-restbase.test.json");
      const result = unmarshalPageSummary({
        requestTitleID: "mount_everest",
        url: "https://en.wikipedia.org/api/rest_v1/page/summary/Mount_Everest",
        headers: HEADERS,
        json
      });
      const expected = reviveFile(
        `${__dirname}/page-summary-expected.test.json`,
        pageSummaryReviver
      );
      assert.deepStrictEqual(result, expected);
    });
  });
});
