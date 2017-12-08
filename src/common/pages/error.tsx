import { h } from "preact";
import Page from "../components/page/page";

export interface Props {
  error: Error;
}

// Note: this page should not require any client-side JavaScript. It is not
// re-rendered on the client and so does not allow interactions such as the app
// menu.
export default {
  status: 500,

  Component({ error }: Props): JSX.Element {
    return (
      <Page title={`Unexpected error: ${error.message}`} subtitle="Error 500">
        <p>
          <pre>
            <code>{error.stack}</code>
          </pre>
        </p>
      </Page>
    );
  },

  title: () => "Unexpected error"
};
