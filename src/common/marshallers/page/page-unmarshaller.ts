import { PageImage } from "../../models/page/image";
import { PageTitleID } from "../../models/page/title";
import {
  Page,
  PageLead,
  PageBody,
  PageSection,
  FilePageImage
} from "../../models/page/page";
import { PageUser, PageUserGender } from "../../models/page/user";
import { IsomorphicHeaders } from "../../types/isomorphic-unfetch-extras";
import { JSONArray, JSONObject } from "../../types/json";
import {
  unmarshalPageTitleID,
  unmarshalPageGeolocation,
  unmarshalETag
} from "../page-base/page-base-unmarshaller";
import { RESTBase } from "../restbase";

export const unmarshalPageImageMap = (json: JSONObject): PageImage[] => {
  const type: RESTBase.PageSections.ThumbnailMap = json as any;
  return Object.keys(type.urls)
    .sort((lhs, rhs) => lhs.localeCompare(rhs, undefined, { numeric: true }))
    .map((width: string) => ({
      url: type.urls[width],
      width: parseInt(width, 10)
    }));
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

export function unmarshalFilePageImage(json: JSONObject): FilePageImage {
  const type: RESTBase.PageSections.FileImage = json as any;
  return {
    thumbnail: {
      url: type.thumburl,
      width: type.thumbwidth,
      height: type.thumbheight,
      landscape: type.thumbwidth > type.thumbheight
    },
    url: type.url
  };
}

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
  if (type.imageinfo) {
    result.fileImage = unmarshalFilePageImage(type.imageinfo as {});
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
