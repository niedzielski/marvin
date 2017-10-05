import { h } from "preact";
import App from "../components/app/app";
import { PageSummary } from "../components/page-summary/page-summary";
import { PageSummary as PageSummaryModel } from "../models/page/summary";
import { PageTitleID, PageTitlePath } from "../models/page/title";
import Page from "../components/page/page";
import { RouteParams } from "../routers/route";
import { request } from "../data-clients/page-summary-data-client";
import ContentHeader from "../components/content-header/content-header";
import ContentFooter from "../components/content-footer/content-footer";

export interface Params extends RouteParams {
  /**
   * When used as an input, an unencoded PageTitleID; when used as an output,
   * an encoded PageTitlePath.
   */
  title: PageTitleID | PageTitlePath;
}

export interface Props {
  summary: PageSummaryModel;
}

export const getInitialProps = ({ title }: Params): Promise<Props> =>
  request({ titlePath: title }).then(summary => ({ summary }));

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
