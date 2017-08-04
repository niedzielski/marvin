const express = require("express");

const { PORT = 3000 } = process.env;
const server = express();

server.use(express.static("dist/client"));

server.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

server.get("*", (req, res) => {
  res.status(404).send("Not found");
});

server.listen(PORT, _ => {
  console.log(`Server started on port ${PORT}`);
});
