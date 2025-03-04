const joi = require("joi");

class PersonalInformationsValidations {
  static update() {
    return joi.object({
      photo_url: joi.string().trim().max(150).allow(null),
      first_name: joi.string().trim().min(2).max(50).required(),
      last_name: joi.string().trim().min(2).max(50).required(),
      email: joi.string().trim().email().max(100).allow(null),
      phone: joi.string().trim().max(30).allow(null),
      date_of_birth: joi.date().max(Date.now()).allow(null),
      nationality: joi.string().trim().max(50).allow(null),
      address: joi.string().trim().max(150).allow(null),
      city: joi.string().trim().max(30).allow(null),
      country: joi.number().allow(null),
      bio: joi.string().trim().min(3).max(5000).allow(null),
    });
  }
}

module.exports = PersonalInformationsValidations;
