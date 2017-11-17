import { h } from "preact";
import App from "../components/app/app";
import Page from "../components/page/page";

export interface Props {
  path: string;
}

export default {
  status: 404,

  Component({ path }: Props): JSX.Element {
    return (
      <App>
        <Page title="Page not found" subtitle="Error 404">
          <p>Not found: {path}</p>
        </Page>
      </App>
    );
  }
};
