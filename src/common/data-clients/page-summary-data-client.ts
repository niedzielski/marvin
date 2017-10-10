import * as fetch from "isomorphic-unfetch";
import { PageSummary } from "../models/page/summary";
import { PageTitlePath } from "../models/page/title";
import { RESTBase } from "../marshallers/restbase";
import { unmarshalPageSummary } from "../marshallers/page-unmarshaller";
import { PageRedirect } from "./page-redirect";

// https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_summary_title
export interface Params {
  titlePath: PageTitlePath;
  redirect?: PageRedirect;
}

const url = ({ titlePath, redirect }: Params) => {
  const redirectParam = redirect === undefined ? "" : `&redirect=${redirect}`;
  return `${RESTBase.BASE_URL}/page/summary/${titlePath}${redirectParam}`;
};

const HEADERS = {
  accept: RESTBase.PageSummary.ACCEPT_HEADER
};

export const request = (params: Params): Promise<PageSummary> =>
  fetch(url(params), { headers: HEADERS })
    .then(response => Promise.all([response.headers, response.json()]))
    .then(([headers, json]) => unmarshalPageSummary({ headers, json }));
