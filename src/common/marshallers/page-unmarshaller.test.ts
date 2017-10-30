import * as assert from "assert";

import { PageImage } from "../models/page/image";
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
  unmarshalPage,
  unmarshalPageLead,
  unmarshalPageBody,
  unmarshalPageImageMap,
  unmarshalPageSection,
  unmarshalPageSections,
  unmarshalPageUser,
  unmarshalPageUserGender
} from "./page-unmarshaller";
import { RESTBase } from "./restbase";
import { EXPECTED_ETAG, HEADERS, reviveFile } from "./utils.test";

const NOW = new Date(Date.now()).toString();

describe("page-unmarshaller", () => {
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
      const expected = reviveFile(
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
      const expected = reviveFile("./page-body-expected.test.json");
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
      const expected = reviveFile("./page-expected.test.json", pageReviver);
      assert.deepStrictEqual(result, expected);
    });
  });
});
