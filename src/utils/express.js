const express = require("express"), config = require("../../config");

const app = express();
app.use(express.json());

app.get("/ping", (_, response) => response.sendStatus(200));

if (config.port) app.listen(config.port);

module.exports = app;