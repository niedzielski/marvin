import * as fetch from "isomorphic-unfetch";
import { PageSummary, PageTitlePath } from "../models/page";
import { unmarshalPageSummary } from "../marshallers/page-unmarshaller";

// https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_summary_title
export interface Params {
  titlePath: PageTitlePath;

  /**
   * When enabled (the default), requests for [redirect pages] return an HTTP
   * 302 with a redirect target in the Location header and content in the body.
   * When disabled, an HTTP 200 response is returned instead.
   *
   * Beware that redirected pre-flighted cross-origin requests (such as those
   * sending custom request headers like Api-User-Agent) will fail in most
   * current browsers due to a [spec bug].
   *
   * [redirect pages]: https://www.mediawiki.org/wiki/Help:Redirects
   * [spec bug]: https://github.com/whatwg/fetch/issues/204
   */
  redirect?: boolean;
}

const url = ({ titlePath, redirect }: Params) => {
  const redirectParam = redirect === undefined ? "" : `&redirect=${redirect}`;
  return `https://en.wikipedia.org/api/rest_v1/page/summary/${titlePath}${redirectParam}`;
};

const HEADERS = {
  accept:
    'application/json; charset=utf-8; profile="https://www.mediawiki.org/wiki/Specs/Summary/1.2.0"'
};

export const requestPageSummary = (params: Params): Promise<PageSummary> =>
  fetch(url(params), { headers: HEADERS })
    .then(response => Promise.all([response.headers, response.json()]))
    .then(([headers, json]) => unmarshalPageSummary({ headers, json }));
