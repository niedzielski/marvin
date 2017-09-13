export interface PageThumbnail {
  URL: string;
  originalURL: string;
  width: number;
  height: number;
}

export interface PageImage {
  URL: string;
  width: number;
  height: number;
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
  titleText: string;
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
