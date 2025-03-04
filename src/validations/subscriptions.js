const joi = require("joi");

class SubscriptionsValidations {
  static subscribe() {
    return joi.object({
      plan_id: joi.string().trim().length(36).required(),
    });
  }
}

module.exports = SubscriptionsValidations;
