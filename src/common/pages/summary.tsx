import { h } from "preact";
import App from "../components/app/app";
import { PageSummary } from "../components/page-summary/page-summary";
import { PageSummary as PageSummaryModel } from "../models/page/summary";
import { PageTitleID, PageTitlePath } from "../models/page/title";
import Page from "../components/page/page";
import { RouteParams } from "../router/route";
import { summary } from "../router/routes";
import { request as requestSummary } from "../http/page-summary-http-client";
import ContentHeader from "../components/content-header/content-header";
import ContentFooter from "../components/content-footer/content-footer";
import HttpResponse from "../http/http-response";
import { RedirectError } from "../http/fetch";
import { unmarshalPageTitleID } from "../marshallers/page-base/page-base-unmarshaller"; // eslint-disable-line max-len

interface PageParams extends Partial<RouteParams> {
  path: {
    /**
     * When used as an input, an (unencoded, not necessarily denormalized)
     * possible PageTitleID; when used as an output of Route.toParams(), an
     * (encoded, not necessarily denormalized) PageTitlePath.
     */
    title: PageTitleID | PageTitlePath | string;
  };
}

// undefined means random input (Route.toPath()) and {} means random output
// (Route.toParams()).
export type Params = PageParams | { path?: undefined } | undefined;

export interface Props {
  summary: PageSummaryModel;
}

function request(
  params: Params = {},
  init?: RequestInit
): Promise<HttpResponse<PageSummaryModel>> {
  return requestSummary(
    params.path === undefined
      ? { random: true, init }
      : { titlePath: params.path.title, init }
  ).catch(error => {
    if (error instanceof RedirectError) {
      const url = summary.toPath({
        path: { title: unmarshalPageTitleID(error.url) }
      });
      throw new RedirectError(error.status, url);
    }

    throw error;
  });
}

export default {
  getInitialProps(params: Params = {}): Promise<HttpResponse<Props>> {
    return request(params).then(({ status, data }) => ({
      status,
      data: { summary: data }
    }));
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
  },

  title: ({ summary }: Props) => summary.titleText
};
