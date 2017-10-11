import * as fetch from "isomorphic-unfetch";
import { PageSummary } from "../models/page/summary";
import { PageTitlePath } from "../models/page/title";
import { RESTBase } from "../marshallers/restbase";
import { unmarshalPageSummary } from "../marshallers/page-unmarshaller";
import { PageRedirect } from "./page-redirect";

// https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_summary_title
// https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_random_format
interface PageParams {
  titlePath: PageTitlePath;
  redirect?: PageRedirect;
  random?: undefined;
}
export type Params = PageParams | { random: true };

const url = (params: Params) => {
  if (params.random) {
    return `${RESTBase.BASE_URL}/page/random/summary`;
  }

  const { titlePath, redirect } = params;
  const redirectParam = redirect === undefined ? "" : `&redirect=${redirect}`;
  return `${RESTBase.BASE_URL}/page/summary/${titlePath}${redirectParam}`;
};

const PAGE_HEADERS = {
  accept: RESTBase.PageSummary.ACCEPT_HEADER
};

const RANDOM_HEADERS = {
  accept: RESTBase.Random.ACCEPT_HEADER
};

export const request = (params: Params): Promise<PageSummary> =>
  fetch(url(params), { headers: params.random ? RANDOM_HEADERS : PAGE_HEADERS })
    .then(response =>
      Promise.all([response.url, response.headers, response.json()])
    )
    .then(([url, headers, json]) => {
      return unmarshalPageSummary({
        url,
        requestTitleID: params.random
          ? undefined
          : decodeURIComponent(params.titlePath),
        headers,
        json
      });
    });
