const joi = require("joi");

class ResumeValidations {
  static create() {
    return joi.object({
      template_id: joi.string().trim().length(36),
      title: joi.string().trim().min(2).max(50).required(),
      objective: joi.string().trim().max(250),
      job_title: joi.string().trim().max(50),
      job_description: joi.string().trim().max(350),
      status: joi.string().trim().equal("PRIVATE", "PUBLIC").required(),
    });
  }

  static update() {
    return joi.object({
      template_id: joi.string().trim().length(36).allow(null),
      title: joi.string().trim().min(2).max(50),
      objective: joi.string().trim().max(250).allow(null),
      job_title: joi.string().trim().max(50).allow(null),
      job_description: joi.string().trim().max(350).allow(null),
      status: joi.string().trim().equal("PRIVATE", "PUBLIC"),
      custom_url: joi
        .string()
        .trim()
        .max(50)
        .regex(/^[a-z0-9_-]+$/)
        .allow(null),
    });
  }
}

module.exports = ResumeValidations;
