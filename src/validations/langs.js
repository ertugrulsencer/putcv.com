const joi = require("joi");

class LangsValidations {
  static create() {
    return joi.object({
      lang_name: joi.string().trim().min(2).max(100).required(),
      degree: joi.number().max(10),
      link: joi.string().trim().max(250).allow(null),
      is_active: joi.boolean().default(true),
    });
  }

  static update() {
    return joi.object({
      lang_name: joi.string().trim().min(2).max(100),
      degree: joi.number().max(10).allow(null),
      link: joi.string().trim().max(250).allow(null),
      is_active: joi.boolean().default(true),
    });
  }

  static swap() {
    return joi.object({
      first_lang_id: joi.string().trim().required(),
      second_lang_id: joi
        .string()
        .trim()
        .required()
        .invalid(joi.ref("first_lang_id")),
    });
  }
}

module.exports = LangsValidations;
