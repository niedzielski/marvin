import * as fetch from "isomorphic-unfetch";
import { Page, PageLead } from "../models/page/page";
import { PageTitlePath } from "../models/page/title";
import {
  unmarshalPage,
  unmarshalPageLead
} from "../marshallers/page-unmarshaller";
import { RESTBase } from "../marshallers/restbase";
import { PageRedirect } from "./page-redirect";
import reencodeRESTBaseTitlePath from "./restbase-title-encoder";

// https://en.wikipedia.org/api/rest_v1/#!/Mobile/get_page_mobile_sections_title_revision
// https://en.wikipedia.org/api/rest_v1/#!/Page_content/get_page_random_format
interface PageParams {
  titlePath: PageTitlePath;
  revision?: number;
  redirect?: PageRedirect;
  random?: undefined;
}
export type Params = PageParams | { random: true };

const section = {
  ALL: { path: "mobile-sections", unmarshal: unmarshalPage },
  LEAD: { path: "mobile-sections-lead", unmarshal: unmarshalPageLead }
};

interface SectionParam {
  section: typeof section.ALL | typeof section.LEAD;
}

const url = ({ section, ...params }: Params & SectionParam) => {
  if (params.random) {
    return `${RESTBase.BASE_URL}/page/random/${section.path}`;
  }

  const { titlePath, revision, redirect } = params;
  const revisionPath = revision === undefined ? "" : `/${revision}`;
  const redirectParam = redirect === undefined ? "" : `&redirect=${redirect}`;

  return `${RESTBase.BASE_URL}/${section.path}/${reencodeRESTBaseTitlePath(
    titlePath
  )}${revisionPath}${redirectParam}`;
};

const PAGE_HEADERS = {
  accept: RESTBase.PageSections.ACCEPT_HEADER
};

const RANDOM_HEADERS = {
  accept: RESTBase.Random.ACCEPT_HEADER
};

const request = (params: Params & SectionParam) =>
  fetch(url(params), { headers: params.random ? RANDOM_HEADERS : PAGE_HEADERS })
    .then(response =>
      Promise.all([response.url, response.headers, response.json()])
    )
    .then(([url, headers, json]) => {
      return params.section.unmarshal({
        url,
        requestTitleID: params.random
          ? undefined
          : decodeURIComponent(params.titlePath),
        headers,
        json
      });
    });

export const requestPage = (params: Params): Promise<Page> =>
  request({ section: section.ALL, ...params }) as Promise<Page>;

export const requestPageLead = (params: Params): Promise<PageLead> =>
  request({ section: section.LEAD, ...params }) as Promise<PageLead>;
