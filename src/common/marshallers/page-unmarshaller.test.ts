import * as assert from "assert";
import * as fetch from "node-fetch";
import { PageSummary, pageSummaryReviver } from "../models/page/summary";
import { PageImage, PageThumbnail } from "../models/page/image";
import { PageGeolocation } from "../models/page/geolocation";
import {
  unmarshalPageGeolocation,
  unmarshalPageImage,
  unmarshalPageThumbnail,
  unmarshalPageSummary
} from "./page-unmarshaller";
import { RESTBase } from "./restbase";

const ETAG_REVISION = 802006980;
const ETAG_TIME_ID = "4f754377-a235-11e7-a776-efb84f18649a";
const HEADERS = new fetch.Headers();
HEADERS.append("etag", `${ETAG_REVISION}/${ETAG_TIME_ID}`);

describe("page-unmarshaller", () => {
  describe(".unmarshalPageThumbnail()", () => {
    [false, true].forEach(landscape => {
      it(`unmarshals ${landscape ? "landscape" : "portrait"}`, () => {
        const width = landscape ? 2 : 1;
        const height = landscape ? 1 : 2;
        const json: RESTBase.PageSummary.Thumbnail = {
          source: "source",
          original: "original",
          width,
          height
        };
        const expected: PageThumbnail = {
          url: "source",
          width,
          height,
          landscape,
          originalURL: "original"
        };
        const actual = unmarshalPageThumbnail(json as {});
        assert.deepStrictEqual(actual, expected);
      });
    });
  });

  describe(".unmarshalPageImage()", () => {
    [false, true].forEach(landscape => {
      it(landscape ? "landscape" : "portrait", () => {
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
        const actual = unmarshalPageImage(json as {});
        assert.deepStrictEqual(actual, expected);
      });
    });
  });

  it(".unmarshalPageGeolocation() unmarshals", () => {
    const json: RESTBase.PageSummary.Geolocation = {
      lat: 1,
      lon: 2
    };
    const expected: PageGeolocation = {
      latitude: 1,
      longitude: 2
    };
    const actual = unmarshalPageGeolocation(json as {});
    assert.deepStrictEqual(actual, expected);
  });

  describe(".unmarshalPageSummary()", () => {
    // eslint-disable-next-line max-len
    it("omits undefined properties and returns extract even when there are no paragraphs", () => {
      const NOW = new Date(Date.now()).toString();
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
        etag: { revision: ETAG_REVISION, timeID: ETAG_TIME_ID },
        wikiLanguageCode: "en",
        localeDirection: "ltr",
        extractText: "extract",
        extractHTML: ["extract_html"]
      };
      const input = { headers: HEADERS, json: json as {} };
      const actual = unmarshalPageSummary(input);
      assert.deepStrictEqual(actual, expected);
    });

    it("unmarshals a server response", () => {
      const input = require("./page-restbase-mount-everest-input.test.json");
      const result = unmarshalPageSummary({ headers: HEADERS, json: input });
      const expected = JSON.parse(
        JSON.stringify(
          require("./page-restbase-mount-everest-expected.test.json")
        ),
        pageSummaryReviver
      );
      assert.deepStrictEqual(result, expected);
    });
  });
});
