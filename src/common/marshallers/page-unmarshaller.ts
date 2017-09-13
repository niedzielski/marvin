import {
  PageGeolocation,
  PageImage,
  PageSummary,
  PageThumbnail
} from "../models/page";

const unmarshalPageThumbnailRESTBase = (
  json: RESTBase.PageThumbnail
): PageThumbnail => ({
  URL: json.source,
  originalURL: json.original,
  width: json.width,
  height: json.height
});
export const unmarshalPageThumbnail = (json: any): PageThumbnail =>
  unmarshalPageThumbnailRESTBase(json);

const unmarshalPageImageRESTBase = (json: RESTBase.PageImage): PageImage => ({
  URL: json.source,
  width: json.width,
  height: json.height
});
export const unmarshalPageImage = (json: any): PageImage =>
  unmarshalPageImageRESTBase(json);

const unmarshalPageGeolocationRESTBase = (
  json: RESTBase.PageGeolocation
): PageGeolocation => ({
  latitude: json.lat,
  longitude: json.lon
});
export const unmarshalPageGeolocation = (json: any): PageGeolocation =>
  unmarshalPageGeolocationRESTBase(json);

const unmarshalPageSummaryRESTBase = (
  json: RESTBase.PageSummary
): PageSummary => ({
  wikiLanguageCode: json.lang,
  localeDirection: json.dir,
  pageID: json.pageid,
  lastModified: new Date(json.timestamp),
  titleText: json.title,
  titleHTML: json.displaytitle,
  descriptionText: json.description,
  extractText: json.extract,
  extractHTML: json.extract_html,
  thumbnail: json.thumbnail && unmarshalPageThumbnail(json.thumbnail),
  image: json.originalimage && unmarshalPageImage(json.originalimage),
  geolocation: json.coordinates && unmarshalPageGeolocation(json.coordinates)
});
export const unmarshalPageSummary = (json: any): PageSummary =>
  unmarshalPageSummaryRESTBase(json);

namespace RESTBase {
  export interface PageThumbnail {
    source: string;
    original: string;
    width: number;
    height: number;
  }

  export interface PageImage {
    source: string;
    width: number;
    height: number;
  }

  export interface PageGeolocation {
    lat: number;
    lon: number;
  }

  export interface PageSummary {
    title: string;
    displaytitle: string;
    pageid: number;
    extract: string;
    extract_html: string; // eslint-disable-line camelcase
    thumbnail?: PageThumbnail;
    originalimage?: PageImage;
    lang: string;
    dir: string;
    timestamp: string;
    description: string;
    coordinates?: PageGeolocation;
  }
}
