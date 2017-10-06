import { h } from "preact";
import App from "../components/app/app";
import ContentHeader from "../components/content-header/content-header";
import { Page as PageModel } from "../models/page/page";
import { PageTitleID, PageTitlePath } from "../models/page/title";
import Page from "../components/page/page";
import { RouteParams } from "../routers/route";
import { requestPage } from "../data-clients/page-data-client";
import ContentSection from "../components/content-section/content-section";
import ContentFooter from "../components/content-footer/content-footer";

export interface Params extends RouteParams {
  /**
   * When used as an input, an unencoded PageTitleID; when used as an output,
   * an encoded PageTitlePath.
   */
  title: PageTitleID | PageTitlePath;
}

export interface Props {
  page: PageModel;
}

export const getInitialProps = ({ title }: Params): Promise<Props> =>
  requestPage({ titlePath: title }).then(page => ({ page }));

export const Component = ({ page }: Props): JSX.Element => (
  <App>
    <Page
      title={<ContentHeader titleHTML={page.titleHTML} />}
      subtitle={page.descriptionText}
      footer={<ContentFooter lastModified={page.lastModified} />}
    >
      {page.sections.map(section => <ContentSection section={section} />)}
    </Page>
  </App>
);
