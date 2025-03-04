const i18nMessages = require("../i18n/Messages.json");

const getLocalizedMessage = (
  controller,
  messageKey,
  lang,
  replacements = null
) => {
  let message = i18nMessages[controller][messageKey][lang];
  if (replacements) {
    Object.keys(replacements).forEach((key) => {
      message = message.replace(`{${key}}`, replacements[key]);
    });
  }
  return message;
};

module.exports = {
  getLocalizedMessage,
};
