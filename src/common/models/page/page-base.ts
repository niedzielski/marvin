import { ETag } from "../etag";
import { PageGeolocation } from "./geolocation";
import { PageTitleText } from "./title";

/**
 * A collection of properties common to page models.
 */
export interface PageBase {
  pageID: number;
  titleText: PageTitleText;
  titleHTML: string;
  lastModified: Date;
  descriptionText: string;
  geolocation?: PageGeolocation;
  etag: ETag;

  // todo: inject TitleID from the location header. Consider preserving the
  //       _requested_ TitleID too if it's useful.
}

export const pageBaseReviver = (key: string, value: any): any =>
  key === "lastModified" ? new Date(value) : value;
