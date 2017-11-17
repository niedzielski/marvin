export namespace RESTBase {
  export const BASE_URL: string = "https://en.wikipedia.org/api/rest_v1";

  // https://phabricator.wikimedia.org/diffusion/GMOA/browse/master/spec.yaml;399c85e3e782ffa7fef2d4a73c4ee85e98c9114d$690
  // https://phabricator.wikimedia.org/diffusion/GMOA/browse/master/lib/util.js;552a924e45d11a0c20b284c252f0b02065a0d44c$210
  export interface Error {
    status?: number;
    type: number;
    title?: string;
    detail?: string;
    method?: string;
    uri?: string;
  }

  /**
   * A response ETag header indicating the revision and render time UUID or
   * "TID" separated by a slash (ex:
   * `ETag: 701384379/154d7bca-c264-11e5-8c2f-1b51b33b59fc`).
   */
  export type ETag = string;

  // https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_summary_title
  export namespace PageSummary {
    export const ACCEPT_HEADER: string =
      'application/json; charset=utf-8; profile="https://www.mediawiki.org/wiki/Specs/Summary/1.2.0"';

    // https://phabricator.wikimedia.org/diffusion/GRES/browse/master/v1/summary.yaml;efa0412225221d49e901fdce0ba2ae88cd6ccc11$139
    export interface Image {
      source: string;
      width: number;
      height: number;
    }

    // https://phabricator.wikimedia.org/diffusion/GRES/browse/master/v1/summary.yaml;efa0412225221d49e901fdce0ba2ae88cd6ccc11$144
    export interface Geolocation {
      lat: number;
      lon: number;
    }

    // https://phabricator.wikimedia.org/diffusion/GRES/browse/master/v1/summary.yaml;efa0412225221d49e901fdce0ba2ae88cd6ccc11$128-144
    export interface PageSummary {
      title: string;
      displaytitle: string;
      pageid: number;
      // https://phabricator.wikimedia.org/diffusion/GMOA/browse/master/lib/transformations/summarize.js;a4f603b2f535d8d153b62044a2210acf22bf6e11$58-59
      extract: string;
      extract_html: string; // eslint-disable-line camelcase
      thumbnail?: Image;
      originalimage?: Image;
      lang: string;
      dir: string;
      timestamp: string;
      description?: string; // Empty on file pages.
      coordinates?: Geolocation;
    }
  }

  // https://en.wikipedia.org/api/rest_v1/#!/Mobile/get_page_mobile_sections_title_revision
  export namespace PageSections {
    export const ACCEPT_HEADER: string = // eslint-disable-line no-redeclare
      'application/json; charset=utf-8; profile="https://www.mediawiki.org/wiki/Specs/mobile-sections/0.12.4"';

    export interface PermissionMap {
      [action: string]: string[];
    }

    export interface ThumbnailMap {
      file: string;
      // Currently: "320", "640", "800", "1024".
      urls: { [width: string]: string };
    }

    export interface FileImage {
      thumburl: string;
      thumbwidth: number;
      thumbheight: number;
      url: string;
      descriptionurl: string;
      descriptionshorturl: string;
    }

    export interface Issue {
      text: string;
    }

    export interface User {
      anon?: boolean;
      user: string;
      gender: string;
    }

    export interface Geolocation {
      latitude: number;
      longitude: number;
    }

    export interface TitlePronunciation {
      url: string;
    }

    export interface AnySection {
      id: number;
      toclevel?: number;
      anchor?: string;
      line?: string;
      text?: string;
      isReferenceSection?: boolean;
    }

    export interface LeadSection {
      id: number;
      text: string;
    }

    export interface SectionOutline {
      id: number;
      toclevel: number;
      anchor: string;
      line: string;
    }

    export interface BodySection extends LeadSection, SectionOutline {
      isReferenceSection?: boolean;
    }

    // https://phabricator.wikimedia.org/diffusion/GMOA/browse/master/spec.yaml;399c85e3e782ffa7fef2d4a73c4ee85e98c9114d$642
    // https://phabricator.wikimedia.org/diffusion/GMOA/browse/master/spec.yaml;399c85e3e782ffa7fef2d4a73c4ee85e98c9114d$625
    export interface Lead {
      error?: Error; // is this possible or only on bad http status code?
      ns: number;
      id: number;
      revision: string;
      lastmodified: string;
      lastmodifier: User;
      displaytitle: string;
      normalizedtitle: string;
      wikibase_item?: string; // eslint-disable-line camelcase
      description?: string;
      protection?: PermissionMap;
      editable: boolean;
      languagecount: number;
      image?: ThumbnailMap;
      hatnotes?: string[];
      sections?: (LeadSection | SectionOutline)[];
      geo?: Geolocation;
      pronunciation?: TitlePronunciation;
      mainpage?: boolean;
      disambiguation?: boolean;
      imageinfo?: FileImage;
    }

    // https://phabricator.wikimedia.org/diffusion/GMOA/browse/master/spec.yaml;399c85e3e782ffa7fef2d4a73c4ee85e98c9114d$680
    // https://phabricator.wikimedia.org/diffusion/GMOA/browse/master/spec.yaml;399c85e3e782ffa7fef2d4a73c4ee85e98c9114d$639
    export interface Body {
      sections?: BodySection[];
    }

    // https://phabricator.wikimedia.org/diffusion/GMOA/browse/master/spec.yaml;399c85e3e782ffa7fef2d4a73c4ee85e98c9114d$608
    export interface Page {
      lead: Lead;
      remaining: Body;
    }
  }

  // https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_random_format
  export namespace Random {
    export const ACCEPT_HEADER: string = // eslint-disable-line no-redeclare
      'application/json; charset=utf-8; profile="https://www.mediawiki.org/wiki/Specs/random/0.6.0"';
  }
}
