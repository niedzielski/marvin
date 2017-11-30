import { IsomorphicHeaders } from "../types/isomorphic-unfetch-extras";
import { JSONObject } from "../types/json";
import { Page, PageLead } from "../models/page/page";
import { PageTitleID, PageTitlePath } from "../models/page/title";
import {
  unmarshalPage,
  unmarshalPageLead
} from "../marshallers/page/page-unmarshaller";
import { RESTBase } from "../marshallers/restbase";
import HttpResponse from "./http-response";
import { RESTBaseRedirect } from "./restbase-redirect";
import * as fetch from "./fetch";
import reencodePathSegment from "./restbase-path-encoder";

// https://en.wikipedia.org/api/rest_v1/#!/Mobile/get_page_mobile_sections_title_revision
// https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_random_format
interface PageParams {
  titlePath: PageTitlePath;
  revision?: number;
  redirect?: RESTBaseRedirect;
  random?: undefined;
}
export type Params = PageParams | { random: true };

function url(params: Params, endpoint: string) {
  if (params.random) {
    return `${RESTBase.BASE_URL}/page/random/${endpoint}`;
  }

  const { titlePath, revision, redirect } = params;
  const revisionPath = revision === undefined ? "" : `/${revision}`;
  const redirectParam = redirect === undefined ? "" : `&redirect=${redirect}`;
  return `${RESTBase.BASE_URL}/page/${endpoint}/${reencodePathSegment(
    titlePath
  )}${revisionPath}${redirectParam}`;
}

const PAGE_HEADERS = [["accept", RESTBase.PageSections.ACCEPT_HEADER]];
const RANDOM_HEADERS = [["accept", RESTBase.Random.ACCEPT_HEADER]];

interface UnmarshalParams {
  url: string;
  requestTitleID?: PageTitleID | string;
  headers: IsomorphicHeaders;
  json: JSONObject;
}

function request<Type>(
  params: Params,
  endpoint: string,
  unmarshal: (params: UnmarshalParams) => Type
): Promise<HttpResponse<Type>> {
  return fetch
    .request(url(params, endpoint), {
      headers: params.random ? RANDOM_HEADERS : PAGE_HEADERS
    })
    .then(response =>
      response
        .json()
        .then(json => [response.status, response.url, response.headers, json])
    )
    .then(([status, url, headers, json]) => {
      const requestTitleID = params.random
        ? undefined
        : decodeURIComponent(params.titlePath);
      return {
        status,
        data: unmarshal({ url, requestTitleID, headers, json })
      };
    });
}

export const requestPage = (params: Params): Promise<HttpResponse<Page>> =>
  request(params, "mobile-sections", unmarshalPage);

export const requestPageLead = (
  params: Params
): Promise<HttpResponse<PageLead>> =>
  request(params, "mobile-sections-lead", unmarshalPageLead);
