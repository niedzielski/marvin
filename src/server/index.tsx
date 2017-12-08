import * as express from "express";
import * as compression from "compression";
import { h } from "preact";
import { render as renderToString } from "preact-render-to-string";
import { RouteResponse, newRouter } from "../common/router/router";
import { RedirectError } from "../common/http/fetch";
import { routes } from "../common/router/routes";
import { SERVER_PORT, SERVER_URL } from "../common/assets/config";
import ErrorPage from "../common/pages/error";
import { formatDocTitle } from "../common/format-doc-title";
import HTMLPage from "./components/html-page";

const server = express();

// Disable useless header.
// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
server.disable("x-powered-by");

server.use(compression());

server.use("/public", express.static("dist/public"));

function render({ chunkName, Component, props, title }: RouteResponse<any>) {
  const docTitle = formatDocTitle(title ? title(props) : undefined);
  // When an unexpected error occurs, forbid client re-rendering so that the
  // original error can be shown.
  const forceSSR = Component === ErrorPage.Component;
  const html = renderToString(
    <HTMLPage title={docTitle} chunkName={chunkName} ssrData={{ forceSSR }}>
      <Component {...props} />
    </HTMLPage>
  );
  return `<!doctype html>${html}`;
}

const router = newRouter(routes);
server.get("*", (request, response) => {
  router
    .route(request.url)
    .then(routeResponse =>
      response.status(routeResponse.status).send(render(routeResponse))
    )
    .catch(error => {
      if (error instanceof RedirectError) {
        return response
          .status(error.status)
          .header("location", error.url)
          .send();
      }

      // todo: show 5xx page and log for Marvin.
      const message = `${error.message}\n${error.stack}`;
      console.error(message); // eslint-disable-line no-console
      return response.status(500).send(message);
    });
});

server.listen(SERVER_PORT, () => {
  console.log(`Server started on ${SERVER_URL}/`); // eslint-disable-line no-console
});
