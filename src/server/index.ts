// Ignore importing style and image files when running on Node.js
import "ignore-styles";

import * as express from "express";
import {
  production,
  serverPort,
  serverUrl,
  webpackDevServerUrl
} from "./configuration";
import { api } from "../common/routers/api";
import page from "./templates/page";
import { render } from "preact-render-to-string";

// The asset manifest built or the webpack-dev-server URL (which has no
// manifest).
const manifest = production
  ? require("../../dist/public/assets-manifest.json")
  : webpackDevServerUrl;

const server = express();

server.use(express.static("dist/public"));

Object.keys(api).forEach(name => {
  const route = api[name];
  server.get(route.path, (_request, response) => {
    route.response().then((m: any) => {
      response.status(route.status).send(
        page({
          title: "",
          body: render(m.default()),
          manifest
        })
      );
    });
  });
});

server.listen(serverPort, () => {
  console.log(`Server started on ${serverUrl}/`); // eslint-disable-line no-console

  if (!production) {
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
