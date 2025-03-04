const express = require("express");
const router = express.Router();

const i18nViews = require("../i18n/views.json");

const languages = [
  {id: "tr", label: "Türkçe"},
  {id: "en", label: "English"},
  {id: "es", label: "Español"},
  {id: "fr", label: "Français"},
  {id: "de", label: "Deutsch"},
  {id: "it", label: "Italiano"},
];

router.get("/", (req, res) => {
  res.render("default.landing.ejs", {
    languages,
    language_key: req.language_key,
    i18n: {
      global: i18nViews.global,
      ...i18nViews.landingDefault,
    },
  });
});
router.get("/features", (req, res) => {
  res.render("features.landing.ejs", {
    languages,
    language_key: req.language_key,
    i18n: i18nViews.landingFeatures,
  });
});
router.get("/prices", (req, res) => {
  res.render("prices.landing.ejs", {
    languages,
    language_key: req.language_key,
    i18n: i18nViews.landingPrices,
  });
});

router.all("*", (req, res) => {
  res.render("errors/notfound.ejs", {
    languages,
    language_key: req.language_key,
    i18nViews,
  });
});

module.exports = router;
