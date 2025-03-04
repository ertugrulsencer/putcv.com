const express = require("express");
const router = express.Router();

const RateLimit = require("../../middlewares/RateLimit");
const Auth = require("../../middlewares/Auth");
const EducationsCtrl = require("../../controllers/educations");
const EducationsValidations = require("../../validations/educations");
const Validator = require("../../middlewares/Validator");

router.post(
  "/:resumeId",
  [RateLimit(25), Auth, Validator(EducationsValidations.create())],
  EducationsCtrl.create
);
router.get("/:resumeId/list", [Auth], EducationsCtrl.list);
router.get("/:resumeId/:educationId", [Auth], EducationsCtrl.detail);
router.put(
  "/:resumeId/:educationId",
  [RateLimit(25), Auth, Validator(EducationsValidations.update())],
  EducationsCtrl.update
);
router.patch(
  "/:resumeId/swap",
  [RateLimit(25), Auth, Validator(EducationsValidations.swap())],
  EducationsCtrl.swap
);
router.delete(
  "/:resumeId/:educationId",
  [RateLimit(25), Auth],
  EducationsCtrl.delete
);

module.exports = router;
