import { h, render } from "preact";
import newHistory from "history/createBrowserHistory";
import "wikimedia-ui-base/wikimedia-ui-base.css";
import "./index.css";
import { RouteResponse, newRouter } from "../common/router/router";
import { SSRData } from "../common/models/ssr-data";
import { WithContext } from "../common/components/with-context";
import { routes } from "../common/router/routes";

// Include preact/debug only in development for React DevTools integration.
// This check needs to be as defined with DefinePlugin in the webpack config so
// that Uglify can remove this if statement in production.
if (process.env.NODE_ENV !== "production") {
  require("preact/debug");
}

const ssrData: SSRData = (window as any).__SSR_DATA__;
const history = newHistory();
const router = newRouter(routes);
const pageRoot = (_ => {
  const root = document.getElementById("root");
  if (root) return root;

  // A "root" container for the app should be present in the Page component.
  throw new Error('Missing element with "root" ID.');
})();

function renderPageRoot({ Component, props }: RouteResponse<any>) {
  render(
    <WithContext history={history}>
      <Component {...props} />
    </WithContext>,
    pageRoot,
    pageRoot.lastElementChild || undefined
  );
}

function route(path: string) {
  router.route(path).then(renderPageRoot);
}

// Observe the History
history.listen((location, action) => {
  route(location.pathname);

  if (action === "PUSH" || action === "REPLACE") {
    // A new destination, reset the window scroll state.
    window.scrollTo(0, 0);
  }
});

// Replace the server rendered root, which does not include CSS, with a styled
// page that manages navigation with History. This enables the single page app
// experience.
if (!ssrData.forceSSR) {
  route(location.pathname);
}
