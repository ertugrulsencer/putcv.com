const express = require("express");
const router = express.Router();

const RateLimit = require("../../middlewares/RateLimit");
const Auth = require("../../middlewares/Auth");
const PersonalInformationsCtrl = require("../../controllers/personal_informations");
const PersonalInformationsValidations = require("../../validations/personal_informations");
const Validator = require("../../middlewares/Validator");

router.get("/:personalInformationsId", [Auth], PersonalInformationsCtrl.detail);
router.put(
  "/:personalInformationsId",
  [RateLimit(25), Auth, Validator(PersonalInformationsValidations.update())],
  PersonalInformationsCtrl.update
);

module.exports = router;
