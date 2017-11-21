import { h } from "preact";
import App from "../components/app/app";
import { PageSummary } from "../components/page-summary/page-summary";
import { PageSummary as PageSummaryModel } from "../models/page/summary";
import { PageTitleID, PageTitlePath } from "../models/page/title";
import Page from "../components/page/page";
import { RouteParams } from "../routers/route";
import { summary } from "../routers/api";
import { request } from "../http/page-summary-http-client";
import ContentHeader from "../components/content-header/content-header";
import ContentFooter from "../components/content-footer/content-footer";
import HttpResponse from "../http/http-response";
import { RedirectError } from "../http/fetch-with-redirect";
import { unmarshalPageTitleID } from "../marshallers/page-base/page-base-unmarshaller"; // eslint-disable-line max-len

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

export default {
  getInitialProps(params: Params = {}): Promise<HttpResponse<Props>> {
    return request(
      params.title === undefined
        ? { random: true }
        : { titlePath: params.title }
    )
      .then(({ status, data }) => ({
        status,
        data: { summary: data }
      }))
      .catch(error => {
        if (error instanceof RedirectError) {
          error = new RedirectError(
            error.status,
            summary.toPath({ title: unmarshalPageTitleID(error.url) })
          );
        }
        throw error;
      });
  },

  Component({ summary }: Props): JSX.Element {
    return (
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
  }
};
