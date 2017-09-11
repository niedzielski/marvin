// Ignore importing style and image files when running on Node.js
import "ignore-styles";

import * as express from "express";
import {
  PRODUCTION,
  SERVER_PORT,
  SERVER_URL,
  WEBPACK_DEV_SERVER_URL
} from "./configuration";
import Page from "./components/Page";
import { api } from "../common/routers/api";
import { h } from "preact";
import { render } from "preact-render-to-string";

// The asset manifest built or the webpack-dev-server URL (which has no
// manifest).
const manifest = PRODUCTION
  ? require("../../dist/public/assets-manifest.json")
  : WEBPACK_DEV_SERVER_URL;

const server = express();

server.use(express.static("dist/public"));

Object.keys(api).forEach(name => {
  const route = api[name];
  server.get(route.path, (_request, response) => {
    route.response().then((module: any) => {
      const Body = module.default;
      const html =
        "<!doctype html>" + // eslint-disable-line prefer-template
        render(
          <Page title="" manifest={manifest}>
            <Body />
          </Page>
        );
      response.status(route.status).send(html);
    });
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