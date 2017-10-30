import { PageImage, PageThumbnail } from "../../models/page/image";
import { PageSummary } from "../../models/page/summary";
import { PageTitleID } from "../../models/page/title";
import { IsomorphicHeaders } from "../../types/isomorphic-unfetch-extras";
import { JSONObject } from "../../types/json";
import {
  unmarshalPageTitleID,
  unmarshalPageGeolocation,
  unmarshalETag
} from "../page-base/page-base-unmarshaller";
import { RESTBase } from "../restbase";

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
