const AccountService = require("../services/account");
const { getLocalizedMessage } = require("../utils/Helper");

class AccountCtrl {
  static async register(req, res) {
    try {
      const register = await AccountService.register(req.body, {
        lang: req.lang_key,
      });
      return res.status(register.code).json({
        ...register,
        message: getLocalizedMessage(
          "account.register",
          register.message,
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

  static async verify(req, res) {
    try {
      const verify = await AccountService.verify(req.query.token, {
        lang: req.lang_key,
      });
      return res.status(verify.code).json({
        ...verify,
        message: getLocalizedMessage(
          "account.verify",
          verify.message,
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

  static async login(req, res) {
    try {
      const login = await AccountService.login(req.body, {
        lang: req.lang_key,
      });
      return res.status(login.code).json({
        ...login,
        message: getLocalizedMessage(
          "account.login",
          login.message,
          req.lang_key,
          {
            full_name: `${login.data?.account?.first_name} ${login.data?.account?.last_name}`,
          }
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

  static async googleAuth(req, res) {
    try {
      const google_auth = await AccountService.googleAuth(req.body, {
        lang: req.lang_key,
      });
      return res.status(google_auth.code).json({
        ...google_auth,
        message: getLocalizedMessage(
          "account.google_auth",
          google_auth.message,
          req.lang_key,
          {
            full_name: `${google_auth.data?.account?.first_name} ${google_auth.data?.account?.last_name}`,
          }
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

  static async forgetPassword(req, res) {
    try {
      const forget_password = await AccountService.forgetPassword(req.body, {
        lang: req.lang_key,
      });
      return res.status(forget_password.code).json({
        ...forget_password,
        message: getLocalizedMessage(
          "account.forgetPassword",
          forget_password.message,
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

  static async resetPassword(req, res) {
    try {
      const reset_password = await AccountService.resetPassword(
        req.query.token,
        req.body,
        { lang: req.lang_key }
      );
      return res.status(reset_password.code).json({
        ...reset_password,
        message: getLocalizedMessage(
          "account.resetPassword",
          reset_password.message,
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

  static checkAuth(req, res) {
    const { account } = req;
    return res.status(200).json({
      code: 200,
      severity: "success",
      message: getLocalizedMessage(
        "account.checkAuth",
        "success",
        req.lang_key
      ),
      data: {
        account,
      },
    });
  }

  static async update(req, res) {
    try {
      const update = await AccountService.update(req.body, req.account, {
        lang: req.lang_key,
      });
      return res.status(update.code).json({
        ...update,
        message: getLocalizedMessage(
          "account.update",
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

  static async changePassword(req, res) {
    try {
      const change_password = await AccountService.changePassword(
        req.body,
        req.account,
        {
          lang: req.lang_key,
        }
      );
      return res.status(change_password.code).json({
        ...change_password,
        message: getLocalizedMessage(
          "account.change_password",
          change_password.message,
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

module.exports = AccountCtrl;
