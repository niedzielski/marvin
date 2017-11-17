import { PageBase, pageBaseReviver } from "./page-base";
import { PageImage } from "./image";
import { PageNamespace } from "./namespace";
import { PagePermissionMap, PageUser } from "./user";

export interface FilePageImage {
  thumbnail: PageImage;
  url: string;
}

export interface PageSection {
  /** Section offset; the lead is zero. */
  index: number;

  /**
   * Zero-based section header or indent level often used as h1, h2, h3, ...
   * The lead is zero and all subsequent sections are one or greater, so for a
   * page with <h1>title</h1> and <h2>title</h2>, one must be added to the level
   * when calculating which h1..6 tag to use.
   */
  level: number;

  /** Section header; the lead is empty. */
  titleHTML: string;

  /** A URL fragment to the section; the lead is empty. */
  fragment: string;

  /** The inner HTML of a section. Empty when an outline or no content. */
  contentHTML: string;

  /** true for reference sections. */
  reference: boolean;
}

export interface PageLead extends PageBase {
  revision: number;
  namespace: PageNamespace;
  mainPage: boolean;
  disambiguationPage: boolean;
  lastModifier: PageUser;
  wikibaseID?: string;
  permissions: PagePermissionMap;
  editable: boolean;
  languageCount: number;
  thumbnail: PageImage[];
  fileImage?: FilePageImage;
  pronunciationURL?: string;
  /**
   * The first index is a fully populated lead section. Subsequent sections do
   * not include content.
   */
  sections: PageSection[];
  htmlHatnotes: string[];
}

export const pageLeadReviver = pageBaseReviver;

export interface PageBody {
  /** Does not include the lead section. */
  sections: PageSection[];
}

export interface Page extends PageLead, PageBody {
  /** Includes the lead section. */
  sections: PageSection[];
}

export const pageReviver = pageBaseReviver;
