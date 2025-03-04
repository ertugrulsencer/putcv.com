const supported_langs = ["en", "tr", "es", "fr", "de", "it"];

module.exports = (req, res, next) => {
  const lang =
    req.headers["accept-language"]?.split(",")[0].slice(0, 2) ?? "en";
  if (supported_langs.includes(lang)) req.lang_key = lang;
  else req.lang_key = "en";
  next();
};
