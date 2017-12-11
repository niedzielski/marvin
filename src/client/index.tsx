import { h, render } from "preact";
import newHistory from "history/createBrowserHistory";
import { Location as HistoricalLocation } from "history";
import "wikimedia-ui-base/wikimedia-ui-base.css";
import "./index.css";
import { RouteResponse, newRouter } from "../common/router/router";
import { SSRData } from "../common/models/ssr-data";
import { WithContext } from "../common/components/with-context";
import { formatDocTitle } from "../common/format-doc-title";
import { routes } from "../common/router/routes";

// Include preact/debug only in development for React DevTools integration.
// This check needs to be as defined with DefinePlugin in the webpack config so
// that Uglify can remove this if statement in production.
if (process.env.NODE_ENV !== "production") require("preact/debug");

const history = newHistory();
const router = newRouter(routes);
const pageRoot = (_ => {
  const root = document.getElementById("root");
  if (root) return root;

  // A "root" container for the app should be present in the Page component.
  throw new Error('Missing element with "root" ID.');
})();

function renderPageRoot({ Component, props, title }: RouteResponse<any>) {
  // Update the window / tab title.
  document.title = formatDocTitle(title ? title(props) : undefined);

  render(
    <WithContext history={history}>
      <Component {...props} />
    </WithContext>,
    pageRoot,
    pageRoot.lastElementChild || undefined
  );
}

function route(location: Location | HistoricalLocation) {
  router.route(location.pathname, location.search).then(renderPageRoot);
}

// Observe the History
history.listen((location, action) => {
  route(location);

  if (action === "PUSH" || action === "REPLACE") {
    // A new destination, reset the window scroll state.
    window.scrollTo(0, 0);
  }
});

// Replace the server rendered root, which does not include CSS, with a styled
// page that manages navigation with History. This enables the single page app
// experience.
const ssrData: SSRData = (window as any).__SSR_DATA__;
if (!ssrData.forceSSR) route(window.location);
