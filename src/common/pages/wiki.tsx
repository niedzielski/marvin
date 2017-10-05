import { h } from "preact";
import App from "../components/app/app";
import Content from "../components/content/content";
import { Page as PageModel } from "../models/page/page";
import { PageTitleID, PageTitlePath } from "../models/page/title";
import Page from "../components/page/page";
import { RouteParams } from "../routers/route";
import { requestPage } from "../data-clients/page-data-client";
import Section from "../components/section";

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
      title={<Title page={page} />}
      subtitle={page.descriptionText}
      footer={<Footer page={page} />}
    >
      {page.sections.map(section => <Section section={section} />)}
    </Page>
  </App>
);

const Title = ({ page }: Props) => (
  <Content>
    <h1 dangerouslySetInnerHTML={{ __html: page.titleHTML }} />
  </Content>
);

const Footer = ({ page }: Props) => (
  <span>Last updated {page.lastModified.toLocaleString("en-GB")}</span>
);
