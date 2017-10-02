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
    export const BASE_URL: string = `${RESTBase.BASE_URL}/page/summary`; // eslint-disable-line no-redeclare

    // https://phabricator.wikimedia.org/diffusion/GRES/browse/master/v1/summary.yaml;efa0412225221d49e901fdce0ba2ae88cd6ccc11$138
    export interface Thumbnail {
      source: string;
      original: string;
      width: number;
      height: number;
    }

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
      thumbnail?: Thumbnail;
      originalimage?: Image;
      lang: string;
      dir: string;
      timestamp: string;
      description: string;
      coordinates?: Geolocation;
    }
  }
}
