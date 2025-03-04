const TemplatesService = require("../services/templates");
const { getLocalizedMessage } = require("../utils/Helper");

class TemplatesCtrl {
  static async list(req, res) {
    try {
      const list = await TemplatesService.list({
        lang: req.lang_key,
        type: req.query?.type,
      });
      return res.status(list.code).json({
        ...list,
        message: getLocalizedMessage(
          "templates.list",
          list.message,
          req.lang_key
        ),
      });
    } catch (error) {
      return res.status(500).json({
        error,
        severity: "error",
        message: getLocalizedMessage("error", "general", req.lang_key),
      });
    }
  }
}

module.exports = TemplatesCtrl;
