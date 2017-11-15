import * as express from "express";
import * as compression from "compression";
import { h } from "preact";
import { render as renderToString } from "preact-render-to-string";
import { RouteResponse, newRouter } from "../common/routers/router";
import { RedirectError } from "../common/http/fetch-with-redirect";
import { routes } from "../common/routers/api";
import {
  PRODUCTION,
  SERVER_PORT,
  SERVER_URL,
  WEBPACK_DEV_SERVER_URL
} from "./config";
import HTMLPage from "./components/html-page";
declare function __non_webpack_require__(name: string): any; // eslint-disable-line camelcase

// The production asset manifest from the public build products or
// the webpack-dev-server URL (which has no manifest). The former doesn't exist
// at compilation time, so use a dynamic require to read it from the filesystem
// at run time in production builds.
const manifest = PRODUCTION
  ? __non_webpack_require__("../public/assets-manifest.json")
  : WEBPACK_DEV_SERVER_URL;

const server = express();

server.use(compression());

server.use("/public", express.static("dist/public"));

const render = ({ chunkName, Component, props }: RouteResponse<any>) => {
  return (
    "<!doctype html>" + // eslint-disable-line prefer-template
    renderToString(
      <HTMLPage title="" manifest={manifest} chunkName={chunkName}>
        <Component {...props} />
      </HTMLPage>
    )
  );
};

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
      } else {
        const message = `${error.message}\n${error.stack}`;
        console.error(message); // eslint-disable-line no-console
        return response.status(500).send(message);
      }
    });
});

server.listen(SERVER_PORT, () => {
  console.log(`Server started on ${SERVER_URL}/`); // eslint-disable-line no-console
});
