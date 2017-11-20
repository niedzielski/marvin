import { PageBase, pageBaseReviver } from "./page-base";
import { PageImage } from "./image";

export interface PageSummary extends PageBase {
  wikiLanguageCode: string;
  localeDirection: string;
  extractText: string;
  extractHTML: string[];
  thumbnail?: PageImage;
  image?: PageImage;
}

export const pageSummaryReviver = pageBaseReviver;
