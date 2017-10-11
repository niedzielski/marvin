import * as assert from "assert";
import * as fetch from "node-fetch";
import { JSONValue } from "../types/json";
import { PageSummary, pageSummaryReviver } from "../models/page/summary";
import { PageImage, PageThumbnail } from "../models/page/image";
import { PageGeolocation } from "../models/page/geolocation";
import { PageNamespace } from "../models/page/namespace";
import {
  Page,
  PageLead,
  PageBody,
  PageSection,
  pageReviver,
  pageLeadReviver
} from "../models/page/page";
import { PageUser, PageUserGender } from "../models/page/user";
import {
  unmarshalETag,
  unmarshalPage,
  unmarshalPageLead,
  unmarshalPageBody,
  unmarshalPageGeolocation,
  unmarshalPageImage,
  unmarshalPageImageMap,
  unmarshalPageThumbnail,
  unmarshalPageSection,
  unmarshalPageSections,
  unmarshalPageSummary,
  unmarshalPageUser,
  unmarshalPageUserGender
} from "./page-unmarshaller";
import { RESTBase } from "./restbase";

const revive = (
  filename: string,
  reviver?: (key: any, value: JSONValue) => any
) => JSON.parse(JSON.stringify(require(filename)), reviver);

const NOW = new Date(Date.now()).toString();

const ETAG_REVISION = 802006980;
const ETAG_TIME_ID = "4f754377-a235-11e7-a776-efb84f18649a";
const HEADERS = new fetch.Headers();
HEADERS.append("etag", `${ETAG_REVISION}/${ETAG_TIME_ID}`);
const EXPECTED_ETAG = { revision: ETAG_REVISION, timeID: ETAG_TIME_ID };

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
        const result = unmarshalPageThumbnail(json as {});
        assert.deepStrictEqual(result, expected);
      });
    });
  });

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

  describe(".unmarshalPageImageMap()", () => {
    it("unmarshals an empty map", () => {
      const json: RESTBase.PageSections.ThumbnailMap = {
        file: "file",
        urls: {}
      };
      const expected: PageImage[] = [];
      const result = unmarshalPageImageMap(json as {});
      assert.deepStrictEqual(result, expected);
    });

    it("unmarshals a nonempty map", () => {
      const json: RESTBase.PageSections.ThumbnailMap = {
        file: "file",
        urls: { 1: "1", 2: "2" }
      };
      const expected: PageImage[] = [
        { url: "1", width: 1 },
        { url: "2", width: 2 }
      ];
      const result = unmarshalPageImageMap(json as {});
      assert.deepStrictEqual(result, expected);
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
    const result = unmarshalPageGeolocation(json as {});
    assert.deepStrictEqual(result, expected);
  });

  it(".unmarshalETag() unmarshals", () => {
    const result = unmarshalETag(HEADERS);
    assert.deepStrictEqual(result, EXPECTED_ETAG);
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
      const expected = revive(
        "./page-summary-expected.test.json",
        pageSummaryReviver
      );
      assert.deepStrictEqual(result, expected);
    });
  });

  describe(".unmarshalPageUserGender()", () => {
    // todo: replace Object.values(PageUserGender) when available.
    ["unknown", "female", "male"].forEach(gender => {
      it(`unmarshals ${gender}`, () => {
        assert.deepStrictEqual(unmarshalPageUserGender(gender), gender);
      });
    });
    it("unmarshals an invalid gender", () => {
      assert.deepStrictEqual(
        unmarshalPageUserGender(""),
        PageUserGender.UNKNOWN
      );
    });
  });

  it(".unmarshalPageUser()", () => {
    const json: RESTBase.PageSections.User = {
      user: "user",
      gender: "female"
    };
    const expected: PageUser = {
      anonymous: false,
      user: "user",
      gender: PageUserGender.FEMALE
    };
    assert.deepStrictEqual(unmarshalPageUser(json as {}), expected);
  });

  describe(".unmarshalPageSection()", () => {
    it("unmarshals with defaults", () => {
      const json: RESTBase.PageSections.AnySection = {
        id: 1
      };
      const expected: PageSection = {
        index: 1,
        level: 0,
        titleHTML: "",
        fragment: "",
        contentHTML: "",
        reference: false
      };
      const result = unmarshalPageSection(json as {});
      assert.deepStrictEqual(result, expected);
    });

    it("unmarshals without defaults", () => {
      const json: RESTBase.PageSections.BodySection = {
        id: 1,
        toclevel: 2,
        anchor: "anchor",
        line: "line",
        text: "text",
        isReferenceSection: true
      };
      const expected: PageSection = {
        index: 1,
        level: 2,
        titleHTML: "line",
        fragment: "anchor",
        contentHTML: "text",
        reference: true
      };
      const result = unmarshalPageSection(json as {});
      assert.deepStrictEqual(result, expected);
    });
  });

  describe(".unmarshalPageSections()", () => {
    it("unmarshals an empty array", () => {
      const json: RESTBase.PageSections.AnySection[] = [];
      const expected: PageSection[] = [];
      const result = unmarshalPageSections(json as {}[]);
      assert.deepStrictEqual(result, expected);
    });

    it("unmarshals a nonempty array", () => {
      const json: RESTBase.PageSections.AnySection[] = [
        {
          id: 1
        }
      ];
      const expected: PageSection[] = [
        {
          index: 1,
          level: 0,
          titleHTML: "",
          fragment: "",
          contentHTML: "",
          reference: false
        }
      ];
      const result = unmarshalPageSections(json as {}[]);
      assert.deepStrictEqual(result, expected);
    });
  });

  describe(".unmarshalPageLead()", () => {
    it("unmarshals omitting undefined properties", () => {
      const json: RESTBase.PageSections.Lead = {
        ns: 1,
        id: 2,
        revision: "3",
        lastmodified: NOW,
        lastmodifier: {
          anon: true,
          user: "user",
          gender: "unknown"
        },
        displaytitle: "displaytitle",
        normalizedtitle: "normalizedtitle",
        editable: true,
        languagecount: 4,
        sections: [
          {
            id: 0,
            text: "text"
          }
        ]
      };
      const expected: PageLead = {
        pageID: 2,
        titleID: "titleID",
        titleText: "normalizedtitle",
        titleHTML: "displaytitle",
        lastModified: new Date(Date.parse(NOW)),
        descriptionText: "",
        etag: EXPECTED_ETAG,
        revision: 3,
        namespace: PageNamespace.TALK,
        mainPage: false,
        disambiguationPage: false,
        lastModifier: {
          anonymous: true,
          user: "user",
          gender: PageUserGender.UNKNOWN
        },
        permissions: {},
        editable: true,
        languageCount: 4,
        thumbnail: [],
        sections: [
          {
            index: 0,
            level: 0,
            titleHTML: "",
            fragment: "",
            contentHTML: "text",
            reference: false
          }
        ],
        htmlHatnotes: []
      };
      const result = unmarshalPageLead({
        url: "titleID",
        headers: HEADERS,
        json: json as {}
      });
      assert.deepStrictEqual(result, expected);
    });

    it("unmarshals a server response", () => {
      const json = require("./page-lead-restbase.test.json");
      const result = unmarshalPageLead({
        url:
          "https://zh.wikipedia.org/api/rest_v1/page/mobile-sections-lead/中國",
        headers: HEADERS,
        json
      });
      const expected = revive(
        "./page-lead-expected.test.json",
        pageLeadReviver
      );
      assert.deepStrictEqual(result, expected);
    });
  });

  describe(".unmarshalPageBody()", () => {
    it("unmarshals omitting undefined properties", () => {
      const json: RESTBase.PageSections.Body = {
        sections: [
          {
            id: 1,
            text: "text",
            toclevel: 2,
            anchor: "anchor",
            line: "line"
          }
        ]
      };
      const expected: PageBody = {
        sections: [
          {
            index: 1,
            level: 2,
            titleHTML: "line",
            fragment: "anchor",
            contentHTML: "text",
            reference: false
          }
        ]
      };
      const result = unmarshalPageBody(json as {});
      assert.deepStrictEqual(result, expected);
    });

    it("unmarshals a server response", () => {
      const json = require("./page-body-restbase.test.json");
      const result = unmarshalPageBody(json);
      const expected = revive("./page-body-expected.test.json");
      assert.deepStrictEqual(result, expected);
    });
  });

  describe(".unmarshalPage()", () => {
    it("unmarshals omitting undefined properties", () => {
      const json: RESTBase.PageSections.Page = {
        lead: {
          ns: 1,
          id: 2,
          revision: "3",
          lastmodified: NOW,
          lastmodifier: { user: "user", gender: "male" },
          displaytitle: "displaytitle",
          normalizedtitle: "normalizedtitle",
          editable: false,
          languagecount: 4
        },
        remaining: {}
      };
      const expected: Page = {
        pageID: 2,
        titleID: "titleID",
        titleText: "normalizedtitle",
        titleHTML: "displaytitle",
        lastModified: new Date(Date.parse(NOW)),
        descriptionText: "",
        etag: EXPECTED_ETAG,
        revision: 3,
        namespace: 1,
        mainPage: false,
        disambiguationPage: false,
        lastModifier: {
          anonymous: false,
          user: "user",
          gender: PageUserGender.MALE
        },
        permissions: {},
        editable: false,
        languageCount: 4,
        thumbnail: [],
        sections: [],
        htmlHatnotes: []
      };
      const result = unmarshalPage({
        url: "titleID",
        headers: HEADERS,
        json: json as {}
      });
      assert.deepStrictEqual(result, expected);
    });

    it("unmarshals a server response", () => {
      const json = require("./page-restbase.test.json");
      const result = unmarshalPage({
        requestTitleID: "calculus",
        url:
          "https://en.wikipedia.org/api/rest_v1/page/mobile-sections/Calculus",
        headers: HEADERS,
        json
      });
      const expected = revive("./page-expected.test.json", pageReviver);
      assert.deepStrictEqual(result, expected);
    });
  });
});
