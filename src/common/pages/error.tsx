import { h } from "preact";
import App from "../components/app/app";
import Page from "../components/page/page";

interface Props {
  error: Error;
}

export default {
  status: 500,

  Component({ error }: Props): JSX.Element {
    return (
      <App>
        <Page title={`Unexpected error: ${error.message}`} subtitle="Error 500">
          <p>
            <pre>
              <code>{error.stack}</code>
            </pre>
          </p>
        </Page>
      </App>
    );
  }
};
