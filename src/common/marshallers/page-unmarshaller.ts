import { PageImage, PageThumbnail } from "../models/page/image";
import { ETag } from "../models/etag";
import { PageGeolocation } from "../models/page/geolocation";
import { PageSummary } from "../models/page/summary";
import { PageTitleID } from "../models/page/title";
import { Page, PageLead, PageBody, PageSection } from "../models/page/page";
import { PageUser, PageUserGender } from "../models/page/user";
import { IsomorphicHeaders } from "../types/isomorphic-unfetch-extras";
import { JSONArray, JSONObject } from "../types/json";
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

export const unmarshalPageImageMap = (json: JSONObject): PageImage[] => {
  const type: RESTBase.PageSections.ThumbnailMap = json as any;
  return Object.keys(type.urls)
    .sort((lhs, rhs) => lhs.localeCompare(rhs, undefined, { numeric: true }))
    .map((width: string) => ({
      url: type.urls[width],
      width: parseInt(width, 10)
    }));
};

export const unmarshalPageGeolocation = (json: JSONObject): PageGeolocation => {
  if (json.latitude) {
    const type: RESTBase.PageSections.Geolocation = json as any;
    return { latitude: type.latitude, longitude: type.longitude };
  } else {
    const type: RESTBase.PageSummary.Geolocation = json as any;
    return { latitude: type.lat, longitude: type.lon };
  }
};

// todo: remove this function and Domino package from package*.json, the
//       corresponding Webpack IgnorePlugin, and the Domino typing, when
//       isomorphic HTML parsing is unneeded. Some other options explored:
// - undom advertises itself as "DOM but not a parser". Parsing, serialization,
//   and selectors are all unsupported. There is a recipe for rudimentary
//   serialization but the real issue is the lack of a parser which is essential
//   to Marvin's use case. The GitHub issues have several discussions of an
//   extensible plugin system that may help fill in these gaps but to date these
//   features are unavailable.
// - This parsing logic could live in the Preact components render cycle but:
//   - Rendering in a component will still require a DOM on the server.
//   - The expected place to receive this data is at unmarshalling time.
// - Only Domino was considered. jsdom and other alternatives were not explored.
// - A new Marvin service endpoint gives the project a great deal of flexibility
//   in how it handles server responses. However, it comes at the great expense
//   of increased complexity and reduced performance:
//   - Marvin already offers client and server code. Adding a service API is a
//     refactor that decreases code clarity.
//   - Requests from the server and the client must be issued to Marvin then
//     reissued to the real data endpoints.
//   - Example implementation: https://gerrit.wikimedia.org/r/#/c/379698/4.
// Domino was chosen for familiarity and because it's already used on the MCS
// backend. This is a service-only dependency so the client filesize is not
// affected at the expense of two different code paths.
const parseExtractHTML = (extractHTML: string) => {
  const element =
    typeof document === "undefined"
      ? require("domino").createDocument().body
      : document.implementation.createHTMLDocument("").body;
  element.innerHTML = extractHTML;

  const paragraphs = Array.from(element.querySelectorAll("p"));
  return paragraphs.length
    ? paragraphs.map((paragraph: HTMLParagraphElement) => paragraph.outerHTML)
    : [extractHTML];
};

export const unmarshalETag = (headers: IsomorphicHeaders): ETag => {
  const etag = headers.get("ETag") as string;
  const [revision, timeID] = etag.split("/");
  return { revision: parseInt(revision, 10), timeID };
};

export function unmarshalPageTitleID(url: string): PageTitleID {
  const titlePath = url.split("/").pop();
  if (titlePath === undefined) {
    throw new Error("titlePath should be known at response time.");
  }
  return decodeURI(titlePath);
}

export const unmarshalPageSummary = ({
  url,
  requestTitleID,
  headers,
  json
}: {
  url: string;
  requestTitleID?: PageTitleID | string;
  headers: IsomorphicHeaders;
  json: JSONObject;
}): PageSummary => {
  const type: RESTBase.PageSummary.PageSummary = json as any;
  const result: PageSummary = {
    pageID: type.pageid,
    titleID: unmarshalPageTitleID(url),
    titleText: type.title,
    titleHTML: type.displaytitle,
    lastModified: new Date(type.timestamp),
    descriptionText: type.description,
    etag: unmarshalETag(headers),

    wikiLanguageCode: type.lang,
    localeDirection: type.dir,
    extractText: type.extract,
    extractHTML: parseExtractHTML(type.extract_html)
  };
  if (requestTitleID !== undefined) {
    result.requestTitleID = requestTitleID;
  }
  if (type.coordinates) {
    result.geolocation = unmarshalPageGeolocation(type.coordinates as {});
  }
  if (type.thumbnail) {
    result.thumbnail = unmarshalPageThumbnail(type.thumbnail as {});
  }
  if (type.originalimage) {
    result.image = unmarshalPageImage(type.originalimage as {});
  }
  return result;
};

export const unmarshalPageUserGender = (json: string): PageUserGender => {
  // Reverse mappings are not yet available for string enums. todo: reevaluate
  // something like:
  //   return json in PageUserGender
  //     ? json as PageUserGender
  //     : PageUserGender.UNKNOWN;
  // https://blogs.msdn.microsoft.com/typescript/2017/06/12/announcing-typescript-2-4-rc/
  switch (json) {
    case "female":
      return PageUserGender.FEMALE;
    case "male":
      return PageUserGender.MALE;
    default:
      return PageUserGender.UNKNOWN;
  }
};

export const unmarshalPageUser = (json: JSONObject): PageUser => {
  const type: RESTBase.PageSections.User = json as any;
  return {
    anonymous: type.anon || false,
    user: type.user,
    gender: unmarshalPageUserGender(type.gender)
  };
};

export const unmarshalPageSection = (json: JSONObject): PageSection => {
  const type: RESTBase.PageSections.AnySection = json as any;
  return {
    index: type.id,
    level: type.toclevel || 0,
    titleHTML: type.line || "",
    fragment: type.anchor || "",
    contentHTML: type.text || "",
    reference: type.isReferenceSection || false
  };
};

export const unmarshalPageSections = (json: JSONArray): PageSection[] => {
  const type: RESTBase.PageSections.AnySection[] = json as any;
  return type.map(section => unmarshalPageSection(section as {}));
};

export const unmarshalPageLead = ({
  url,
  requestTitleID,
  headers,
  json
}: {
  url: string;
  requestTitleID?: PageTitleID | string;
  headers: IsomorphicHeaders;
  json: JSONObject;
}): PageLead => {
  const type: RESTBase.PageSections.Lead = json as any;
  const result: PageLead = {
    pageID: type.id,
    titleID: unmarshalPageTitleID(url),
    titleText: type.normalizedtitle,
    titleHTML: type.displaytitle,
    lastModified: new Date(type.lastmodified),
    descriptionText: type.description || "",
    etag: unmarshalETag(headers),

    revision: parseInt(type.revision, 10),
    namespace: type.ns,
    mainPage: type.mainpage || false,
    disambiguationPage: type.disambiguation || false,
    lastModifier: unmarshalPageUser(type.lastmodifier as {}),
    permissions: type.protection || {},
    editable: type.editable,
    languageCount: type.languagecount,
    thumbnail: (type.image && unmarshalPageImageMap(type.image as {})) || [],
    htmlHatnotes: type.hatnotes || [],
    sections:
      (type.sections && unmarshalPageSections(type.sections as {}[])) || []
  };
  if (requestTitleID !== undefined) {
    result.requestTitleID = requestTitleID;
  }
  if (type.geo) {
    result.geolocation = unmarshalPageGeolocation(type.geo as {});
  }
  if (type.wikibase_item) {
    result.wikibaseID = type.wikibase_item;
  }
  if (type.pronunciation) {
    result.pronunciationURL = type.pronunciation.url;
  }
  return result;
};

export const unmarshalPageBody = (json: JSONObject): PageBody => {
  const type: RESTBase.PageSections.Body = json as any;
  return {
    sections:
      (type.sections && unmarshalPageSections(type.sections as {}[])) || []
  };
};

export const unmarshalPage = ({
  url,
  requestTitleID,
  headers,
  json
}: {
  url: string;
  requestTitleID?: PageTitleID | string;
  headers: IsomorphicHeaders;
  json: JSONObject;
}): Page => {
  const type: RESTBase.PageSections.Page = json as any;
  const lead = unmarshalPageLead({
    url,
    requestTitleID,
    headers,
    json: type.lead as {}
  });
  const body = unmarshalPageBody(type.remaining as {});
  return {
    ...lead,
    sections:
      (lead.sections.length && [lead.sections[0], ...body.sections]) || []
  };
};
