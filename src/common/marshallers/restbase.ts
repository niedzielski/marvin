export namespace RESTBase {
  // https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_summary_title
  export namespace PageSummary {
    export interface Thumbnail {
      source: string;
      original: string;
      width: number;
      height: number;
    }

    export interface Image {
      source: string;
      width: number;
      height: number;
    }

    export interface Geolocation {
      lat: number;
      lon: number;
    }

    export interface PageSummary {
      title: string;
      displaytitle: string;
      pageid: number;
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
