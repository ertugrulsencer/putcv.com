const PorjectsService = require("../services/projects");
const { getLocalizedMessage } = require("../utils/Helper");

class ProjectsCtrl {
  static async create(req, res) {
    try {
      const create = await PorjectsService.create(
        req.params.resumeId,
        req.body,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(create.code).json({
        ...create,
        message: getLocalizedMessage(
          "projects.create",
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
      const list = await PorjectsService.list(
        req.params.resumeId,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(list.code).json({
        ...list,
        message: getLocalizedMessage(
          "projects.list",
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
      const detail = await PorjectsService.detail(
        req.params.resumeId,
        req.params.projectId,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(detail.code).json({
        ...detail,
        message: getLocalizedMessage(
          "projects.detail",
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
      const update = await PorjectsService.update(
        req.params.resumeId,
        req.params.projectId,
        req.body,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(update.code).json({
        ...update,
        message: getLocalizedMessage(
          "projects.update",
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
      const swap = await PorjectsService.swap(
        req.params.resumeId,
        req.body,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(swap.code).json({
        ...swap,
        message: getLocalizedMessage(
          "projects.swap",
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
      const _delete = await PorjectsService.delete(
        req.params.resumeId,
        req.params.projectId,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(_delete.code).json({
        ..._delete,
        message: getLocalizedMessage(
          "projects.delete",
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

module.exports = ProjectsCtrl;
