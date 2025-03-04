const supportedLanguages = ["en", "tr", "es", "fr", "de", "it"];

module.exports = (req, res, next) => {
  const langFromUrl =
    req.params[0] ??
    req.headers["accept-language"]?.split(",")[0].slice(0, 2) ??
    "en";
  // if (!supportedLanguages.includes(langFromUrl)) {
  //   return res.status(404).render("errors/notfound.ejs", {
  //     language_key: "en",
  //     i18nViews: require("../i18n/views.json"),
  //   });
  // }

  req.language_key = !supportedLanguages.includes(langFromUrl)
    ? "en"
    : langFromUrl;
  next();
};
