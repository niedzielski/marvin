import { h } from "preact";
import App from "../components/app/app";
import { PageTitleID, PageTitlePath } from "../models/page/title";
import { RouteParams } from "../routers/route";

export interface Params extends RouteParams {
  /**
   * When used as an input, an unencoded PageTitleID; when used as an output,
   * an encoded PageTitlePath.
   */
  title: PageTitleID | PageTitlePath;
}

export interface Props {
  title: string;
}

export const getInitialProps = ({ title }: Params): Promise<Props> =>
  Promise.resolve({ title });

export const Component = ({ title }: Props): JSX.Element => <App>{title}</App>;
