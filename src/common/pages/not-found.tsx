import { h } from "preact";
import App from "../components/app/app";
import Page from "../components/page/page";

export interface Props {
  path: string;
  query?: string;
}

// Note: visually, this page may have some similarities to the generic
// unexpected error page. However, this module should be kept distinct because
// it permits interaction and may be rendered client-side, unlike the error
// generic error page.
export default {
  status: 404,

  Component({ path, query }: Props): JSX.Element {
    return (
      <App>
        <Page title="Page not found" subtitle="Error 404">
          <p>
            Not found: path={path} query={query}
          </p>
        </Page>
      </App>
    );
  },

  title: () => "Not found"
};
