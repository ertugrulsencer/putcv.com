const joi = require("joi");
const { template_type_enum } = require("../drizzle/schema");

class TemplatesValidations {
  static list() {
    return joi.object({
      type: joi
        .string()
        .trim()
        .uppercase()
        .equal(...template_type_enum.enumValues),
    });
  }
}

module.exports = TemplatesValidations;
