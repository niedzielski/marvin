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

interface PageParams extends RouteParams {
  /**
   * When used as an input, an (unencoded, not necessarily denormalized)
   * possible PageTitleID; when used as an output of Route.toParams(), an
   * (encoded, not necessarily denormalized) PageTitlePath.
   */
  title: PageTitleID | PageTitlePath | string;
  revision?: string;
}
// undefined means random input (Route.toPath()) and {} means random output
// (Route.toParams()).
export type Params =
  | PageParams
  | { title?: undefined; revision?: undefined }
  | undefined;

export interface Props {
  page: PageModel;
}

export const getInitialProps = (params: Params = {}): Promise<Props> =>
  requestPage(
    params.title === undefined
      ? { random: true }
      : {
          titlePath: params.title,
          revision:
            params.revision === undefined
              ? undefined
              : parseInt(params.revision, 10)
        }
  ).then(page => ({ page }));

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
