import { h } from "preact";
import App from "../components/app/app";
import { RouteParams } from "../routers/route";

export interface Params extends RouteParams {
  /**
   * A special match-all wildcard property will return the full URL path. e.g.,
   * /foo/bar/baz. This group comes from the not-found RouteConfig.path,
   * `"(.*)"`.
   */
  0: string;
}

export const Component = (): JSX.Element => (
  <App>
    <p>Not found</p>
  </App>
);
