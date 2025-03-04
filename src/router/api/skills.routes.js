const express = require("express");
const router = express.Router();

const RateLimit = require("../../middlewares/RateLimit");
const Auth = require("../../middlewares/Auth");
const SkillsCtrl = require("../../controllers/skills");
const SkillsValidations = require("../../validations/skills");
const Validator = require("../../middlewares/Validator");

router.post(
  "/:resumeId",
  [RateLimit(25), Auth, Validator(SkillsValidations.create())],
  SkillsCtrl.create
);
router.get("/:resumeId/list", [Auth], SkillsCtrl.list);
router.get("/:resumeId/:skillId", [Auth], SkillsCtrl.detail);
router.put(
  "/:resumeId/:skillId",
  [RateLimit(25), Auth, Validator(SkillsValidations.update())],
  SkillsCtrl.update
);
router.patch(
  "/:resumeId/swap",
  [RateLimit(25), Auth, Validator(SkillsValidations.swap())],
  SkillsCtrl.swap
);
router.delete("/:resumeId/:skillId", [RateLimit(25), Auth], SkillsCtrl.delete);

module.exports = router;
