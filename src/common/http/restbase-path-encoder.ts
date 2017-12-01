/**
 * @param {!string} segment URL-encoded path segment.
 * @return URL-encoded path segment with slashes encoded.
 */
export default function reencodePathSegment(segment: string): string {
  // RESTBase doesn't understand page titles with slashes in them. An encoded
  // path cannot be blindly reencoded with encodeURIComponent() because that may
  // doubly encode characters which gives different meaning when its unencoded
  // only once. Instead, target slashes specifically. Ampersands (&) and percent
  // signs (%) are understood, question marks are not supported unencoded by
  // Marvin or wikipedia.org's /wiki/... endpoint.
  //
  // Supported:
  // - http://localhost:3000/wiki//
  // - http://localhost:3000/wiki/%2f
  // - http://localhost:3000/wiki/%3f
  // - https://en.wikipedia.org/wiki//
  // - https://en.wikipedia.org/wiki/%2f
  // - https://en.wikipedia.org/wiki/%3f
  // - https://en.wikipedia.org/api/rest_v1/page/mobile-sections/%2f
  // - https://en.wikipedia.org/api/rest_v1/page/mobile-sections/%3f
  //
  // Unsupported:
  // - http://localhost:3000/wiki/?
  // - https://en.wikipedia.org/wiki/?
  // - https://en.wikipedia.org/api/rest_v1/page/mobile-sections//
  // - https://en.wikipedia.org/api/rest_v1/page/mobile-sections/?
  return segment.replace("/", "%2f");
}
