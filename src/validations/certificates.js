const joi = require("joi");

class CertificatesValidations {
  static create() {
    return joi.object({
      certificate_name: joi.string().trim().min(2).max(100).required(),
      authority: joi.string().trim().min(2).max(100).allow(null),
      link: joi.string().trim().max(250).allow(null),
      date: joi.date().max(Date.now()).allow(null),
      is_active: joi.boolean().default(true),
    });
  }

  static update() {
    return joi.object({
      certificate_name: joi.string().trim().min(2).max(100).required(),
      authority: joi.string().trim().min(2).max(100).allow(null),
      link: joi.string().trim().max(250).allow(null),
      date: joi.date().max(Date.now()).allow(null),
      is_active: joi.boolean().default(true),
    });
  }

  static swap() {
    return joi.object({
      first_certificate_id: joi.string().trim().required(),
      second_certificate_id: joi
        .string()
        .trim()
        .required()
        .invalid(joi.ref("first_certificate_id")),
    });
  }
}

module.exports = CertificatesValidations;
