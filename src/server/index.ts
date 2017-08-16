import * as express from "express";
import page, { AssetsManifest } from "./templates/page";
import app from "../common/components/app";

const isProd: boolean = process.env.NODE_ENV === "production";

// The asset manifest built or the webpack-dev-server URL (which has no manifest).
const assets: AssetsManifest | string = isProd
  ? require("../../dist/public/assets-manifest.json")
  : "http://localhost:8080";

const { PORT = 3000 } = process.env;
const server = express();

server.use(express.static("dist/public"));

server.get("/", (_req: express.Request, res: express.Response) => {
  res.status(200).send(page({ title: "", body: app(), assets }));
});

server.get("*", (_req: express.Request, res: express.Response) => {
  res.status(404).send("Not found");
});

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`); // eslint-disable-line no-console

  if (!isProd) {
    const touch = require("touch");

    // The server is now listening and ready to receive requests. If developmental, touch the client
    // sources to trigger a webpack-dev-server file watch event which triggers a browser reload. If
    // the server was previously running, the browser will be updated with the latest results. The
    // negative offset accounts for: https://github.com/webpack/watchpack/issues/25.
    const nowish: number = Date.now() - 10 * 1000;
    touch("src/client/index.ts", { time: nowish });
  }
});
