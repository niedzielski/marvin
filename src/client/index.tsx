import { h, render } from "preact";
import newHistory from "history/createBrowserHistory";
import "wikimedia-ui-base/wikimedia-ui-base.css";
import "./index.css";
import { RouteResponse, newRouter } from "../common/routers/router";
import { WithContext } from "../common/components/with-context";
import { routes } from "../common/routers/api";

const history = newHistory();
const router = newRouter(routes);
const pageRoot = document.getElementById("root");
if (!pageRoot) {
  // A "root" container for the app should be present in the Page component.
  throw new Error('Missing element with "root" ID.');
}

const renderPageRoot = ({ Component, props }: RouteResponse<any, any>) => {
  render(
    <WithContext history={history}>
      <Component {...props} />
    </WithContext>,
    pageRoot,
    pageRoot.lastElementChild || undefined
  );
};

const route = (path: string) => router.route(path).then(renderPageRoot);

// Observe the History
history.listen(location => route(location.pathname));

// Replace the server rendered root, which does not include CSS, with a styled
// page that manages navigation with History. This enables the single page app
// experience.
route(location.pathname);
