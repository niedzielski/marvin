import { PageTitlePath } from "../models/page/title";

export default function reencodeRESTBaseTitlePath(
  title: PageTitlePath
): PageTitlePath {
  // RESTBase doesn't understand page titles with slashes in them. An encoded
  // path cannot be blindly reencoded with encodeURIComponent() because that may
  // doubly encode characters which gives different meaning when its unencoded
  // only once. Instead, target slashes specifically.
  return title.replace("/", "%2f");
}
