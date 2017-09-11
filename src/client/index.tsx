import "./index.css";
import { RouteResponse, newRouter } from "../common/routers/router";
import { h, render } from "preact";
import { WithContext } from "../client/components/with-context";
import newHistory from "history/createBrowserHistory";
import { routes } from "../common/routers/api";

const history = newHistory();
const router = newRouter(routes);
const pageRoot = document.getElementById("root");
if (!pageRoot) {
  // A "root" container for the app should be present in the Page component.
  throw new Error('Missing element with "root" ID.');
}

const renderPageRoot = (endpoint: RouteResponse<any, any>) => {
  const Body = endpoint.component;
  render(
    <WithContext history={history}>
      <Body {...endpoint.properties} />
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
