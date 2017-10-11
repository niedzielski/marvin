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

const section = {
  ALL: { path: "page/mobile-sections", unmarshal: unmarshalPage },
  LEAD: { path: "page/mobile-sections-lead", unmarshal: unmarshalPageLead },
  BODY: {
    path: "page/mobile-sections-remaining",
    unmarshal: ({
      json
    }: {
      url: string;
      requestTitleID?: string;
      headers: IsomorphicHeaders;
      json: JSONObject;
    }) => unmarshalPageBody(json)
  }
};

interface SectionParam {
  section: typeof section.ALL | typeof section.LEAD | typeof section.BODY;
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
    .then(response =>
      Promise.all([response.url, response.headers, response.json()])
    )
    .then(([url, headers, json]) => {
      return params.section.unmarshal({
        url,
        requestTitleID: decodeURIComponent(params.titlePath),
        headers,
        json
      });
    });

export const requestPage = (params: Params): Promise<Page> =>
  request({ section: section.ALL, ...params }) as Promise<Page>;

export const requestPageLead = (params: Params): Promise<PageLead> =>
  request({ section: section.LEAD, ...params }) as Promise<PageLead>;

export const requestPageBody = (params: Params): Promise<PageBody> =>
  request({ section: section.BODY, ...params }) as Promise<PageBody>;
