const CoverLettersService = require("../services/cover_letters");
const { getLocalizedMessage } = require("../utils/Helper");

class CoverLettersCtrl {
  static async create(req, res) {
    try {
      const create = await CoverLettersService.create(req.body, req.account, {
        lang: req.lang_key,
      });
      return res.status(create.code).json({
        ...create,
        message: getLocalizedMessage(
          "cover_letter.create",
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
      const list = await CoverLettersService.list(req.account, {
        lang: req.lang_key,
      });
      return res.status(list.code).json({
        ...list,
        message: getLocalizedMessage(
          "cover_letter.list",
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

  static async detail(req, res) {
    try {
      const detail = await CoverLettersService.detail(
        req.params.coverLetterId,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(detail.code).json({
        ...detail,
        message: getLocalizedMessage(
          "cover_letter.detail",
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
      const update = await CoverLettersService.update(
        req.params.coverLetterId,
        req.body,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(update.code).json({
        ...update,
        message: getLocalizedMessage(
          "cover_letter.update",
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

  static async delete(req, res) {
    try {
      const _delete = await CoverLettersService.delete(
        req.params.coverLetterId,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(_delete.code).json({
        ..._delete,
        message: getLocalizedMessage(
          "cover_letter.delete",
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

module.exports = CoverLettersCtrl;
