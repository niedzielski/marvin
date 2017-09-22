import { h } from "preact";
import App from "../components/app/app";
import Content from "../components/content/content";
import { PageSummary } from "../components/page-summary/page-summary";
import {
  PageSummary as PageSummaryModel,
  PageTitleID,
  PageTitlePath
} from "../models/page";
import Page from "../components/page/page";
import { RouteParams } from "../routers/route";
import { requestPageSummary } from "../data-clients/page-data-client";

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

export const initialProps = ({ title }: Params): Promise<Props> =>
  requestPageSummary({ titlePath: title }).then(summary => ({ summary }));

export const Component = ({ summary }: Props): JSX.Element => (
  <App>
    <Page
      title={<Title summary={summary} />}
      subtitle={summary.descriptionText}
      footer={<Footer summary={summary} />}
    >
      <PageSummary summary={summary} />
    </Page>
  </App>
);

const Title = ({ summary }: Props) => (
  <Content>
    <h1 dangerouslySetInnerHTML={{ __html: summary.titleHTML }} />
  </Content>
);

const Footer = ({ summary }: Props) => (
  <span>Last updated {summary.lastModified.toLocaleString("en-GB")}</span>
);
