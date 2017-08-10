const express = require("express");
const page = require("./templates/page");
const assets = require("../../dist/public/assets-manifest.json");

const { PORT = 3000 } = process.env;
const server = express();

server.use(express.static("dist/public"));

server.get("/", (req, res) => {
  res.status(200).send(page({ body: "Hello World!", assets }));
});

server.get("*", (req, res) => {
  res.status(404).send("Not found");
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`); // eslint-disable-line no-console
});
