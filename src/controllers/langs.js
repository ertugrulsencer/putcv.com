const LangsService = require("../services/langs");
const { getLocalizedMessage } = require("../utils/Helper");

class LangsCtrl {
  static async create(req, res) {
    try {
      const create = await LangsService.create(
        req.params.resumeId,
        req.body,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(create.code).json({
        ...create,
        message: getLocalizedMessage(
          "langs.create",
          create.message,
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

  static async list(req, res) {
    try {
      const list = await LangsService.list(req.params.resumeId, req.account, {
        lang: req.lang_key,
      });
      return res.status(list.code).json({
        ...list,
        message: getLocalizedMessage("langs.list", list.message, req.lang_key),
      });
    } catch (error) {
      return res.status(500).json({
        error,
        severity: "error",
        message: getLocalizedMessage("error", "general", req.lang_key),
      });
    }
  }

  static async detail(req, res) {
    try {
      const detail = await LangsService.detail(
        req.params.resumeId,
        req.params.langId,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(detail.code).json({
        ...detail,
        message: getLocalizedMessage(
          "langs.detail",
          detail.message,
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

  static async update(req, res) {
    try {
      const update = await LangsService.update(
        req.params.resumeId,
        req.params.langId,
        req.body,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(update.code).json({
        ...update,
        message: getLocalizedMessage(
          "langs.update",
          update.message,
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

  static async swap(req, res) {
    try {
      const swap = await LangsService.swap(
        req.params.resumeId,
        req.body,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(swap.code).json({
        ...swap,
        message: getLocalizedMessage("langs.swap", swap.message, req.lang_key),
      });
    } catch (error) {
      return res.status(500).json({
        error,
        severity: "error",
        message: getLocalizedMessage("error", "general", req.lang_key),
      });
    }
  }

  static async delete(req, res) {
    try {
      const _delete = await LangsService.delete(
        req.params.resumeId,
        req.params.langId,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(_delete.code).json({
        ..._delete,
        message: getLocalizedMessage(
          "langs.delete",
          _delete.message,
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

module.exports = LangsCtrl;
