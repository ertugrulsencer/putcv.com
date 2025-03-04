const joi = require("joi");

class AccountValidations {
  static register() {
    return joi.object({
      photo_url: joi.string().trim().max(150).allow(null),
      first_name: joi.string().trim().max(50).required(),
      last_name: joi.string().trim().max(30).required(),
      email: joi.string().trim().email().max(100).required(),
      password: joi.string().trim().min(8).max(50).required(),
    });
  }

  static verify() {
    return joi.object({
      token: joi.string().trim().max(300).required(),
    });
  }

  static login() {
    return joi.object({
      email: joi.string().trim().email().max(100).required(),
      password: joi.string().trim().max(50).required(),
    });
  }

  static googleAuth() {
    return joi.object({
      google_access_token: joi.string().trim().max(300).required(),
    });
  }

  static forgetPassword() {
    return joi.object({
      email: joi.string().trim().email().max(100).required(),
    });
  }

  static resetPasswordQuery() {
    return joi.object({
      token: joi.string().trim().max(300).required(),
    });
  }

  static resetPasswordBody() {
    return joi.object({
      password: joi.string().trim().min(8).max(50).required(),
    });
  }

  static update() {
    return joi.object({
      photo_url: joi.string().trim().max(150).allow(null),
      first_name: joi.string().trim().max(50),
      last_name: joi.string().trim().max(30),
    });
  }

  static changePassword() {
    return joi.object({
      password: joi.string().trim().max(50).required(),
      new_password: joi.string().trim().min(8).max(50).required(),
    });
  }
}

module.exports = AccountValidations;
