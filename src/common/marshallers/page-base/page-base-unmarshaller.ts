import { ETag } from "../../models/etag";
import { PageGeolocation } from "../../models/page/geolocation";
import { PageTitleID } from "../../models/page/title";
import { IsomorphicHeaders } from "../../types/isomorphic-unfetch-extras";
import { JSONObject } from "../../types/json";
import { RESTBase } from "../restbase";

export function unmarshalPageTitleID(url: string): PageTitleID {
  // Titles themselves may contain slashes, however, RESTBase only understands
  // titles with encoded slashes so when this unmarshaller encounters a slash it
  // may safely consider this a path segment and not part of the title.
  const titlePath = url.split("/").pop();
  if (titlePath === undefined) {
    throw new Error("titlePath should be known at response time.");
  }
  return decodeURI(titlePath);
}

export const unmarshalPageGeolocation = (json: JSONObject): PageGeolocation => {
  if (json.latitude) {
    const type: RESTBase.PageSections.Geolocation = json as any;
    return { latitude: type.latitude, longitude: type.longitude };
  } else {
    const type: RESTBase.PageSummary.Geolocation = json as any;
    return { latitude: type.lat, longitude: type.lon };
  }
};

export const unmarshalETag = (headers: IsomorphicHeaders): ETag => {
  const etag = headers.get("ETag") as string;
  const [revision, timeID] = etag.split("/");
  return { revision: parseInt(revision, 10), timeID };
};
