import {
  PageGeolocation,
  PageImage,
  PageSummary,
  PageThumbnail
} from "../models/page";
import { JSONObject } from "../types/json";

export const unmarshalPageThumbnail = (json: JSONObject): PageThumbnail => {
  const type: RESTBase.PageThumbnail = json as any;
  return {
    url: type.source,
    originalURL: type.original,
    width: type.width,
    height: type.height
  };
};

export const unmarshalPageImage = (json: JSONObject): PageImage => {
  const type: RESTBase.PageImage = json as any;
  return { url: type.source, width: type.width, height: type.height };
};

export const unmarshalPageGeolocation = (json: JSONObject): PageGeolocation => {
  const type: RESTBase.PageGeolocation = json as any;
  return { latitude: type.lat, longitude: type.lon };
};

export const unmarshalPageSummary = (json: JSONObject): PageSummary => {
  const type: RESTBase.PageSummary = json as any;
  return {
    wikiLanguageCode: type.lang,
    localeDirection: type.dir,
    pageID: type.pageid,
    lastModified: new Date(type.timestamp),
    titleText: type.title,
    titleHTML: type.displaytitle,
    descriptionText: type.description,
    extractText: type.extract,
    extractHTML: type.extract_html,
    thumbnail: type.thumbnail && unmarshalPageThumbnail(type.thumbnail as {}),
    image: type.originalimage && unmarshalPageImage(type.originalimage as {}),
    geolocation:
      type.coordinates && unmarshalPageGeolocation(type.coordinates as {})
  };
};

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
