const EducationsService = require("../services/educations");
const { getLocalizedMessage } = require("../utils/Helper");

class EducationsCtrl {
  static async create(req, res) {
    try {
      const create = await EducationsService.create(
        req.params.resumeId,
        req.body,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(create.code).json({
        ...create,
        message: getLocalizedMessage(
          "educations.create",
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
      const list = await EducationsService.list(
        req.params.resumeId,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(list.code).json({
        ...list,
        message: getLocalizedMessage(
          "educations.list",
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
      const detail = await EducationsService.detail(
        req.params.resumeId,
        req.params.educationId,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(detail.code).json({
        ...detail,
        message: getLocalizedMessage(
          "educations.detail",
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
      const update = await EducationsService.update(
        req.params.resumeId,
        req.params.educationId,
        req.body,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(update.code).json({
        ...update,
        message: getLocalizedMessage(
          "educations.update",
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
      const swap = await EducationsService.swap(
        req.params.resumeId,
        req.body,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(swap.code).json({
        ...swap,
        message: getLocalizedMessage(
          "educations.swap",
          swap.message,
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
      const _delete = await EducationsService.delete(
        req.params.resumeId,
        req.params.educationId,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(_delete.code).json({
        ..._delete,
        message: getLocalizedMessage(
          "educations.delete",
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

module.exports = EducationsCtrl;
