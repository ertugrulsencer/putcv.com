const express = require("express");
const router = express.Router();

const RateLimit = require("../../middlewares/RateLimit");
const Auth = require("../../middlewares/Auth");
const AccountCtrl = require("../../controllers/account");
const AccountValidations = require("../../validations/account");
const Validator = require("../../middlewares/Validator");

router.post(
  "/register",
  [RateLimit(5), Validator(AccountValidations.register())],
  AccountCtrl.register
);
router.get(
  "/verify",
  [RateLimit(5), Validator(AccountValidations.verify(), "query")],
  AccountCtrl.verify
);
router.post(
  "/login",
  [RateLimit(5), Validator(AccountValidations.login())],
  AccountCtrl.login
);
router.post(
  "/google-auth",
  [RateLimit(5), Validator(AccountValidations.googleAuth())],
  AccountCtrl.googleAuth
);
router.post(
  "/forget-password",
  [RateLimit(5), Validator(AccountValidations.forgetPassword())],
  AccountCtrl.forgetPassword
);
router.patch(
  "/reset-password",
  [
    RateLimit(5),
    Validator(AccountValidations.resetPasswordQuery(), "query"),
    Validator(AccountValidations.resetPasswordBody()),
  ],
  AccountCtrl.resetPassword
);
router.get("/check-auth", [RateLimit(50), Auth], AccountCtrl.checkAuth);
router.put(
  "/update",
  [RateLimit(50), Auth, Validator(AccountValidations.update())],
  AccountCtrl.update
);
router.patch(
  "/change-password",
  [RateLimit(50), Auth, Validator(AccountValidations.changePassword())],
  AccountCtrl.changePassword
);

module.exports = router;
