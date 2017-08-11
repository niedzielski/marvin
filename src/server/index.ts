import * as express from "express";
import page, { AssetsManifest } from "./templates/page";
import app from "../common/components/app";

let assets: AssetsManifest = {};
try {
  assets = require("../../dist/public/assets-manifest.json");
} catch (e) {
  if (process.env.NODE_ENV === "production") {
    throw e;
  } else {
    console.error("Unable to load the static assets manifest file");
  }
}

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
  console.log(`Server started on port ${PORT}`); // eslint-disable-line no-console
});
