import { PageBase, pageBaseReviver } from "./page-base";
import { PageImage, PageThumbnail } from "./image";

export interface PageSummary extends PageBase {
  wikiLanguageCode: string;
  localeDirection: string;
  extractText: string;
  extractHTML: string[];
  thumbnail?: PageThumbnail;
  image?: PageImage;
}

export const pageSummaryReviver = pageBaseReviver;
