/**
 * A response ETag header indicating the revision and render time UUID or
 * "TID" (ex: `701384379/154d7bca-c264-11e5-8c2f-1b51b33b59fc`). This ETag can
 * be passed to the HTML save end point (as the base_etag POST parameter), and
 * can also be used to retrieve the exact corresponding data-parsoid metadata,
 * by requesting the specific revision and time UUID / TID indicated by the
 * ETag.
 */
export interface ETag {
  revision: number;
  timeID: string;
}
