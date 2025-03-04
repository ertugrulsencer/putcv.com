const joi = require("joi");

class CoverLettersValidations {
  static create() {
    return joi.object({
      template_id: joi.string().trim().length(36),
      title: joi.string().trim().min(2).max(50).required(),
      personal_informations: joi.object().allow(null),
      company_informations: joi.object().allow(null),
      content: joi.string().trim().max(10000).allow(null),
      date: joi.date().allow(null),
    });
  }

  static update() {
    return joi.object({
      template_id: joi.string().trim().length(36).allow(null),
      title: joi.string().trim().min(2).max(50),
      personal_informations: joi.object().allow(null),
      company_informations: joi.object().allow(null),
      content: joi.string().trim().max(10000).allow(null),
      date: joi.date().allow(null),
    });
  }
}

module.exports = CoverLettersValidations;
