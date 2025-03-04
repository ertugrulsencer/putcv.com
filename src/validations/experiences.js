const joi = require("joi");

class ExperiencesValidations {
  static create() {
    return joi.object({
      title: joi.string().trim().min(2).max(100).required(),
      description: joi.string().trim().min(2).max(1500).allow(null),
      company: joi.string().trim().min(2).max(150).allow(null),
      location: joi.string().trim().max(50).allow(null),
      start_date: joi.date().max(Date.now()).allow(null),
      end_date: joi.date().max(Date.now()).allow(null),
      is_active: joi.boolean().default(true),
    });
  }

  static update() {
    return joi.object({
      title: joi.string().trim().min(2).max(100).required(),
      description: joi.string().trim().min(2).max(1500).allow(null),
      company: joi.string().trim().min(2).max(150).allow(null),
      location: joi.string().trim().max(50).allow(null),
      start_date: joi.date().max(Date.now()).allow(null),
      end_date: joi.date().max(Date.now()).allow(null),
      is_active: joi.boolean().default(true),
    });
  }

  static swap() {
    return joi.object({
      first_experience_id: joi.string().trim().required(),
      second_experience_id: joi
        .string()
        .trim()
        .required()
        .invalid(joi.ref("first_experience_id")),
    });
  }
}

module.exports = ExperiencesValidations;
