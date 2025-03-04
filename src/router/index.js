const express = require("express");
const router = express.Router();

const Lang = require("../middlewares/Lang");
const Language = require("../middlewares/Language");

const api_routes = require("./api");
const webhook_routes = require("./webhook.routes");
const landing_routes = require("./landing.routes");

router.use("/api", express.json(), Lang, api_routes);
router.use("/webhook", webhook_routes);

router.get("/", (req, res) =>
  res.redirect(
    `/${req.headers["accept-language"]?.split(",")[0].slice(0, 2) ?? "en"}`
  )
);
router.use(/\/(en|tr|es|fr|de|it)/, Language, landing_routes);

router.all("*", Language, (req, res) => {
  res.redirect(`${process.env.BASE}/${req.language_key}${req.url}`);
});

module.exports = router;
