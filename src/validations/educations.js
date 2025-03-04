const joi = require("joi");

class EducationsValidations {
  static create() {
    return joi.object({
      title: joi.string().trim().min(2).max(100).required(),
      institution_name: joi.string().trim().min(2).max(100).allow(null),
      degree: joi.string().trim().min(2).max(50).allow(null),
      location: joi.string().trim().max(50).allow(null),
      description: joi.string().trim().min(2).max(2500).allow(null),
      start_date: joi.date().max(Date.now()).allow(null),
      end_date: joi.date().max(Date.now()).allow(null),
      currently: joi.boolean(),
      is_active: joi.boolean().default(true),
    });
  }

  static update() {
    return joi.object({
      title: joi.string().trim().min(2).max(100).required(),
      institution_name: joi.string().trim().min(2).max(100).allow(null),
      degree: joi.string().trim().min(2).max(50).allow(null),
      location: joi.string().trim().max(50).allow(null),
      description: joi.string().trim().min(2).max(2500).allow(null),
      start_date: joi.date().max(Date.now()).allow(null),
      end_date: joi.date().max(Date.now()).allow(null),
      currently: joi.boolean(),
      is_active: joi.boolean().default(true),
    });
  }

  static swap() {
    return joi.object({
      first_education_id: joi.string().trim().required(),
      second_education_id: joi
        .string()
        .trim()
        .required()
        .invalid(joi.ref("first_education_id")),
    });
  }
}

module.exports = EducationsValidations;
