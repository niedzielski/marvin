import {
  PageGeolocation,
  PageImage,
  PageSummary,
  PageThumbnail
} from "../models/page";
import { JSONObject } from "../types/json";
import { RESTBase } from "./restbase";

export const unmarshalPageThumbnail = (json: JSONObject): PageThumbnail => {
  const type: RESTBase.PageSummary.Thumbnail = json as any;
  return {
    url: type.source,
    originalURL: type.original,
    width: type.width,
    height: type.height,
    landscape: type.width > type.height
  };
};

export const unmarshalPageImage = (json: JSONObject): PageImage => {
  const type: RESTBase.PageSummary.Image = json as any;
  return {
    url: type.source,
    width: type.width,
    height: type.height,
    landscape: type.width > type.height
  };
};

export const unmarshalPageGeolocation = (json: JSONObject): PageGeolocation => {
  const type: RESTBase.PageSummary.Geolocation = json as any;
  return { latitude: type.lat, longitude: type.lon };
};

export const unmarshalPageSummary = (json: JSONObject): PageSummary => {
  const type: RESTBase.PageSummary.PageSummary = json as any;
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
