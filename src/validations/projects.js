const joi = require("joi");

class ProjectsValidations {
  static create() {
    return joi.object({
      title: joi.string().trim().min(2).max(50).required(),
      role: joi.string().trim().min(2).max(50).allow(null),
      location: joi.string().trim().max(50).allow(null),
      description: joi.string().trim().min(2).max(2500).allow(null),
      link: joi.string().trim().min(2).max(250).allow(null),
      start_date: joi.date().max(Date.now()).allow(null),
      end_date: joi.date().max(Date.now()).allow(null),
      currently: joi.boolean(),
      is_active: joi.boolean().default(true),
    });
  }

  static update() {
    return joi.object({
      title: joi.string().trim().min(2).max(50).required(),
      role: joi.string().trim().min(2).max(50).allow(null),
      location: joi.string().trim().max(50).allow(null),
      description: joi.string().trim().min(2).max(2500).allow(null),
      link: joi.string().trim().min(2).max(250).allow(null),
      start_date: joi.date().max(Date.now()).allow(null),
      end_date: joi.date().max(Date.now()).allow(null),
      currently: joi.boolean(),
      is_active: joi.boolean().default(true),
    });
  }

  static swap() {
    return joi.object({
      first_project_id: joi.string().trim().required(),
      second_project_id: joi
        .string()
        .trim()
        .required()
        .invalid(joi.ref("first_project_id")),
    });
  }
}

module.exports = ProjectsValidations;
