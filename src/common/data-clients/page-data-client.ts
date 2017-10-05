import * as fetch from "isomorphic-unfetch";
import { Page, PageBody, PageLead } from "../models/page/page";
import { PageTitlePath } from "../models/page/title";
import {
  unmarshalPage,
  unmarshalPageBody,
  unmarshalPageLead
} from "../marshallers/page-unmarshaller";
import { RESTBase } from "../marshallers/restbase";
import { IsomorphicHeaders } from "../types/isomorphic-unfetch-extras";
import { JSONObject } from "../types/json";
import { PageRedirect } from "./page-redirect";

// https://en.wikipedia.org/api/rest_v1/#!/Mobile/get_page_mobile_sections_title_revision
export interface Params {
  titlePath: PageTitlePath;
  revision?: number;
  redirect?: PageRedirect;
}

type UnmarshalParams = {
  headers: IsomorphicHeaders;
  json: JSONObject;
};

const ALL = new class All {
  get path() {
    return "page/mobile-sections";
  }
  unmarshal({ headers, json }: UnmarshalParams) {
    return unmarshalPage({ headers, json });
  }
}();

const LEAD = new class Lead {
  get path() {
    return "page/mobile-sections-lead";
  }
  unmarshal({ headers, json }: UnmarshalParams) {
    return unmarshalPageLead({ headers, json });
  }
}();

const BODY = new class Body {
  get path() {
    return "page/mobile-sections-remaining";
  }
  unmarshal({ json }: UnmarshalParams) {
    return unmarshalPageBody(json);
  }
}();

type Section = typeof ALL | typeof LEAD | typeof BODY;

interface SectionParam {
  section: Section;
}

const url = ({
  titlePath,
  revision,
  redirect,
  section
}: Params & SectionParam) => {
  const revisionPath = revision === undefined ? "" : `/${revision}`;
  const redirectParam = redirect === undefined ? "" : `&redirect=${redirect}`;

  // eslint-disable-next-line max-len
  return `${RESTBase.BASE_URL}/${section.path}/${titlePath}${revisionPath}${redirectParam}`;
};

const HEADERS = {
  accept: RESTBase.PageSections.ACCEPT_HEADER
};

const request = (params: Params & SectionParam) =>
  fetch(url(params), { headers: HEADERS })
    .then(response => Promise.all([response.headers, response.json()]))
    .then(([headers, json]) => params.section.unmarshal({ headers, json }));

export const requestPage = (params: Params): Promise<Page> =>
  request({ section: ALL, ...params }) as Promise<Page>;

export const requestPageLead = (params: Params): Promise<PageLead> =>
  request({ section: LEAD, ...params }) as Promise<PageLead>;

export const requestPageBody = (params: Params): Promise<PageBody> =>
  request({ section: BODY, ...params }) as Promise<PageBody>;
