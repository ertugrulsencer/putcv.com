const joi = require("joi");

class ReferencesValidations {
  static create() {
    return joi.object({
      company: joi.string().trim().min(2).max(150).required(),
      person: joi.string().trim().min(2).max(50).allow(null),
      contact_email: joi.string().trim().email().max(100).allow(null),
      contact_phone: joi.string().trim().min(2).max(30).allow(null),
      description: joi.string().trim().min(2).max(2500).allow(null),
      is_active: joi.boolean().default(true),
    });
  }

  static update() {
    return joi.object({
      company: joi.string().trim().min(2).max(150).required(),
      person: joi.string().trim().min(2).max(50).allow(null),
      contact_email: joi.string().trim().email().max(100).allow(null),
      contact_phone: joi.string().trim().min(2).max(30).allow(null),
      description: joi.string().trim().min(2).max(2500).allow(null),
      is_active: joi.boolean().default(true),
    });
  }

  static swap() {
    return joi.object({
      first_reference_id: joi.string().trim().required(),
      second_reference_id: joi
        .string()
        .trim()
        .required()
        .invalid(joi.ref("first_reference_id")),
    });
  }
}

module.exports = ReferencesValidations;
