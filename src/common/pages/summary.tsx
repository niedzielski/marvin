import { h } from "preact";
import App from "../components/app/app";
import { PageSummary } from "../components/page-summary/page-summary";
import { PageSummary as PageSummaryModel } from "../models/page/summary";
import { PageTitleID, PageTitlePath } from "../models/page/title";
import Page from "../components/page/page";
import { RouteParams } from "../routers/route";
import { request } from "../http/page-summary-http-client";
import ContentHeader from "../components/content-header/content-header";
import ContentFooter from "../components/content-footer/content-footer";
import HttpResponse from "../http/http-response";

interface PageParams extends RouteParams {
  /**
   * When used as an input, an (unencoded, not necessarily denormalized)
   * possible PageTitleID; when used as an output of Route.toParams(), an
   * (encoded, not necessarily denormalized) PageTitlePath.
   */
  title: PageTitleID | PageTitlePath | string;
}
// undefined means random input (Route.toPath()) and {} means random output
// (Route.toParams()).
export type Params = PageParams | { title?: undefined } | undefined;

export interface Props {
  summary: PageSummaryModel;
}

export const getInitialProps = (
  params: Params = {}
): Promise<HttpResponse<Props>> =>
  request(
    params.title === undefined ? { random: true } : { titlePath: params.title }
  ).then(({ status, data }) => ({
    status,
    data: { summary: data }
  }));

export const Component = ({ summary }: Props): JSX.Element => (
  <App>
    <Page
      title={<ContentHeader titleHTML={summary.titleHTML} />}
      subtitle={summary.descriptionText}
      footer={<ContentFooter lastModified={summary.lastModified} />}
    >
      <PageSummary summary={summary} />
    </Page>
  </App>
);
