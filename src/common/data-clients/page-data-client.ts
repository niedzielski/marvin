import * as fetch from "isomorphic-unfetch";
import { PageSummary, PageTitlePath } from "../models/page";
import { unmarshalPageSummary } from "../marshallers/page-unmarshaller";

export interface Params {
  titlePath: PageTitlePath;
}

const url = ({ titlePath }: Params) =>
  `https://en.wikipedia.org/api/rest_v1/page/summary/${titlePath}`;

const HEADERS = {
  accept:
    'application/json; charset=utf-8; profile="https://www.mediawiki.org/wiki/Specs/Summary/1.2.0"'
};

export const requestPageSummary = (params: Params): Promise<PageSummary> =>
  fetch(url(params), { headers: HEADERS })
    .then((response: Response) => response.json())
    .then(unmarshalPageSummary);
