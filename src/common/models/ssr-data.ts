/**
 * Server-side rendered data. This data is serialized by the server and
 * deserialized by the client through the `window.__SSR_DATA__` global which is
 * set prior to any client script execution.
 */
export interface SSRData {
  /** Forbid client-side rendering of subsequently requested pages. */
  forceSSR: boolean;
}
