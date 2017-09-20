/**
 * URL-decoded normalized wiki URL path. e.g.: Main_Page,
 * Bill_&_Ted's_Excellent_Adventure.
 */
export type PageTitleID = string;

/**
 * URL-encoded normalized wiki URL path. e.g.: Main_Page,
 * Bill_%26_Ted%27s_Excellent_Adventure.
 */
export type PageTitlePath = string;

/**
 * Plain text localized page title. e.g.:
 *   Possible: Banana, Main Page, Bill & Ted's Excellent Adventure, Talk:Pie.
 *   Impossible: Main_Page, Bill_%26_Ted%27s_Excellent_Adventure.
 */
export type PageTitleText = string;

export interface PageImage {
  url: string;
  width: number;
  height: number;
  landscape: boolean;
}

export interface PageThumbnail extends PageImage {
  originalURL: string;
}

export interface PageGeolocation {
  latitude: number;
  longitude: number;
}

export interface PageSummary {
  wikiLanguageCode: string;
  localeDirection: string;
  pageID: number;
  lastModified: Date;
  titleText: PageTitleText;
  titleHTML: string;
  descriptionText: string;
  extractText: string;
  extractHTML: string;
  thumbnail?: PageThumbnail;
  image?: PageImage;
  geolocation?: PageGeolocation;
}

export const pageSummaryReviver = (key: string, value: any): any =>
  key === "lastModified" ? new Date(value) : value;
