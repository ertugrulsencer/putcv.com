require("dotenv/config");
const express = require("express");
const helmet = require("helmet");
const expressFileupload = require("express-fileupload");
const compression = require("compression");
const Cors = require("./src/middlewares/Cors");
const router = require("./src/router");
const app = express();

app.set("trust proxy", 1);
app.set("strict routing", true);
app.set("view-engine", "ejs");
app.set("views", "./src/views");

app.use(Cors);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
app.use(compression());
app.use(expressFileupload());
app.use(express.static("./src/resources"));
app.use(router);

app.listen(process.env.APP_PORT, process.env.APP_HOST, () =>
  console.log(
    `Server is running on: http://${process.env.APP_HOST}:${process.env.APP_PORT}`
  )
);
