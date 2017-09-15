import { h } from "preact";
import App from "../components/app/app";
import { PageSummary } from "../components/page-summary/page-summary";
import {
  PageSummary as PageSummaryModel,
  PageTitleID,
  PageTitlePath
} from "../models/page";
import Paper from "../components/paper/paper";
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
    <Paper>
      <PageSummary summary={summary} />
    </Paper>
  </App>
);
