import * as fetch from "isomorphic-unfetch";
import { PageSummary } from "../models/page/summary";
import { PageTitlePath } from "../models/page/title";
import { RESTBase } from "../marshallers/restbase";
import { unmarshalPageSummary } from "../marshallers/page-summary-unmarshaller";
import HttpResponse from "./http-response";
import { PageRedirect } from "./page-redirect";
import reencodeRESTBaseTitlePath from "./restbase-title-encoder";

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
  return `${RESTBase.BASE_URL}/page/summary/${reencodeRESTBaseTitlePath(
    titlePath
  )}${redirectParam}`;
};

const PAGE_HEADERS = {
  accept: RESTBase.PageSummary.ACCEPT_HEADER
};

const RANDOM_HEADERS = {
  accept: RESTBase.Random.ACCEPT_HEADER
};

// todo: this can actually return an empty response when redirect is false. Do
//       we want to support it? Same question for the other redirect usages.
export const request = (params: Params): Promise<HttpResponse<PageSummary>> =>
  fetch(url(params), { headers: params.random ? RANDOM_HEADERS : PAGE_HEADERS })
    .then(response =>
      response
        .json()
        .then(json => [response.status, response.url, response.headers, json])
    )
    .then(([status, url, headers, json]) => {
      return {
        status,
        data: unmarshalPageSummary({
          url,
          requestTitleID: params.random
            ? undefined
            : decodeURIComponent(params.titlePath),
          headers,
          json
        })
      };
    });
