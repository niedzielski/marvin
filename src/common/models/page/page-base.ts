import { ETag } from "../etag";
import { PageGeolocation } from "./geolocation";
import { PageTitleID, PageTitleText } from "./title";

/**
 * A collection of properties common to page models.
 */
export interface PageBase {
  pageID: number;
  /**
   * For a redirected page, the resultant PageTitleID. For a non-redirected
   * page, identical to requestTitleID.
   */
  titleID: PageTitleID;
  titleText: PageTitleText;
  titleHTML: string;
  /** An (unencoded) PageTitleID that is not necessarily denormalized. */
  requestTitleID?: PageTitleID | string;
  lastModified: Date;
  descriptionText?: string;
  geolocation?: PageGeolocation;
  etag: ETag;
}

export const pageBaseReviver = (key: string, value: any): any =>
  key === "lastModified" ? new Date(value) : value;
