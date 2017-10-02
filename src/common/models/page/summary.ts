import { RESTBase } from "../../marshallers/restbase";
import { PageGeolocation } from "./geolocation";
import { PageImage, PageThumbnail } from "./image";
import { PageTitleText } from "./title";

export interface PageSummary {
  wikiLanguageCode: string;
  localeDirection: string;
  pageID: number;
  lastModified: Date;
  titleText: PageTitleText;
  titleHTML: string;
  descriptionText: string;
  extractText: string;
  extractHTML: string[];
  thumbnail?: PageThumbnail;
  image?: PageImage;
  geolocation?: PageGeolocation;
  etag: RESTBase.ETag;
}

export const pageSummaryReviver = (key: string, value: any): any =>
  key === "lastModified" ? new Date(value) : value;
