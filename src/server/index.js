const fs = require("fs");
const express = require("express");
const page = require("./templates/page");
const assets = require("../../dist/client/assets-manifest.json");

const { PORT = 3000 } = process.env;
const server = express();

server.use(express.static("dist/client"));

server.get("/", (req, res) => {
  res.status(200).send(page({ body: "Hello World!", assets }));
});

server.get("*", (req, res) => {
  res.status(404).send("Not found");
});

server.listen(PORT, _ => {
  console.log(`Server started on port ${PORT}`);
});
