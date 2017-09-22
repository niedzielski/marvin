import * as fs from "fs";
// Ignore importing style and image files when running on Node.js
import register from "ignore-styles";
register(undefined, (module: any, filename: string) => {
  // Fake that requiring SVG files returns a default export with the string of
  // the svg, which is what svg-inline-loader does with webpack for the client
  // code.
  // TODO: Consider using wepback for node code to avoid this and the CSS hacks
  if (filename.endsWith(".svg")) {
    module.exports = { default: fs.readFileSync(filename).toString() };
  }
});

import * as express from "express";
import * as compression from "compression";
import { h } from "preact";
import { render as renderToString } from "preact-render-to-string";

import { RouteResponse, newRouter } from "../common/routers/router";
import { routes } from "../common/routers/api";
import {
  PRODUCTION,
  SERVER_PORT,
  SERVER_URL,
  WEBPACK_DEV_SERVER_URL
} from "./configuration";
import HTMLPage from "./components/html-page";

// The asset manifest built or the webpack-dev-server URL (which has no
// manifest).
const manifest = PRODUCTION
  ? require("../../dist/public/assets-manifest.json")
  : WEBPACK_DEV_SERVER_URL;

const server = express();

server.use(compression());

server.use("/public", express.static("dist/public"));

const render = ({ chunkName, Component, props }: RouteResponse<any, any>) => {
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
      const message = `${error.message}\n${error.stack}`;
      console.error(message); // eslint-disable-line no-console
      response.status(500).send(message);
    });
});

server.listen(SERVER_PORT, () => {
  console.log(`Server started on ${SERVER_URL}/`); // eslint-disable-line no-console

  if (!PRODUCTION) {
    const touch = require("touch");

    // The server is now listening and ready to receive requests. If
    // developmental, touch the client sources to trigger a webpack-dev-server
    // file watch event which triggers a browser reload. If the server was
    // previously running, the browser will be updated with the latest results.
    // The negative offset accounts for:
    // https://github.com/webpack/watchpack/issues/25.
    const nowish: number = Date.now() - 10 * 1000;
    touch("src/client/index.tsx", { time: nowish });
  }
});
