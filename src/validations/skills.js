const joi = require("joi");

class SkillsValidations {
  static create() {
    return joi.object({
      skill_name: joi.string().trim().min(2).max(100).required(),
      tags: joi.array().default([]),
      link: joi.string().trim().max(250).allow(null),
      is_active: joi.boolean().default(true),
    });
  }

  static update() {
    return joi.object({
      skill_name: joi.string().trim().min(2).max(100),
      tags: joi.array().default([]),
      link: joi.string().trim().max(250).allow(null),
      is_active: joi.boolean().default(true),
    });
  }

  static swap() {
    return joi.object({
      first_skill_id: joi.string().trim().required(),
      second_skill_id: joi
        .string()
        .trim()
        .required()
        .invalid(joi.ref("first_skill_id")),
    });
  }
}

module.exports = SkillsValidations;
