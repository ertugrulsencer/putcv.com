const express = require("express");
const router = express.Router();

const RateLimit = require("../../middlewares/RateLimit");
const Auth = require("../../middlewares/Auth");
const ExperiencesCtrl = require("../../controllers/experiences");
const ExperiencesValidations = require("../../validations/experiences");
const Validator = require("../../middlewares/Validator");

router.post(
  "/:resumeId",
  [RateLimit(25), Auth, Validator(ExperiencesValidations.create())],
  ExperiencesCtrl.create
);
router.get("/:resumeId/list", [Auth], ExperiencesCtrl.list);
router.get("/:resumeId/:experienceId", [Auth], ExperiencesCtrl.detail);
router.put(
  "/:resumeId/:experienceId",
  [RateLimit(25), Auth, Validator(ExperiencesValidations.update())],
  ExperiencesCtrl.update
);
router.patch(
  "/:resumeId/swap",
  [RateLimit(25), Auth, Validator(ExperiencesValidations.swap())],
  ExperiencesCtrl.swap
);
router.delete(
  "/:resumeId/:experienceId",
  [RateLimit(25), Auth],
  ExperiencesCtrl.delete
);

module.exports = router;
