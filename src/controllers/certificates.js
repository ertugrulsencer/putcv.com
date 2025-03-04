const CertificatesService = require("../services/certificates");
const { getLocalizedMessage } = require("../utils/Helper");

class CertificatesCtrl {
  static async create(req, res) {
    try {
      const create = await CertificatesService.create(
        req.params.resumeId,
        req.body,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(create.code).json({
        ...create,
        message: getLocalizedMessage(
          "certificates.create",
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
      const list = await CertificatesService.list(
        req.params.resumeId,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(list.code).json({
        ...list,
        message: getLocalizedMessage(
          "certificates.list",
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
      const detail = await CertificatesService.detail(
        req.params.resumeId,
        req.params.certificateId,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(detail.code).json({
        ...detail,
        message: getLocalizedMessage(
          "certificates.detail",
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
      const update = await CertificatesService.update(
        req.params.resumeId,
        req.params.certificateId,
        req.body,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(update.code).json({
        ...update,
        message: getLocalizedMessage(
          "certificates.update",
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
      const swap = await CertificatesService.swap(
        req.params.resumeId,
        req.body,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(swap.code).json({
        ...swap,
        message: getLocalizedMessage(
          "certificates.swap",
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
      const _delete = await CertificatesService.delete(
        req.params.resumeId,
        req.params.certificateId,
        req.account,
        { lang: req.lang_key }
      );
      return res.status(_delete.code).json({
        ..._delete,
        message: getLocalizedMessage(
          "certificates.delete",
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

module.exports = CertificatesCtrl;
