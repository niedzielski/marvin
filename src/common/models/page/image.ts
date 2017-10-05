export interface PageImage {
  url: string;
  width: number;
  height?: number;
  landscape?: boolean;
}

export interface PageThumbnail extends PageImage {
  originalURL: string;
}
