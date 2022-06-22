// load http server
const express = require("express");
const http = require("http");
const cors = require("cors");

const port = 4000;

// setup express
const app = express();
app.use(cors());

const server = http.createServer(app);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(port, () => {
  console.log("server started on port", port);
});
