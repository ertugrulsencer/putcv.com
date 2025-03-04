const express = require("express");
const router = express.Router();

const RateLimit = require("../../middlewares/RateLimit");
const Auth = require("../../middlewares/Auth");
const LangsCtrl = require("../../controllers/langs");
const LangsValidations = require("../../validations/langs");
const Validator = require("../../middlewares/Validator");

router.post(
  "/:resumeId",
  [RateLimit(25), Auth, Validator(LangsValidations.create())],
  LangsCtrl.create
);
router.get("/:resumeId/list", [Auth], LangsCtrl.list);
router.get("/:resumeId/:langId", [Auth], LangsCtrl.detail);
router.put(
  "/:resumeId/:langId",
  [RateLimit(25), Auth, Validator(LangsValidations.update())],
  LangsCtrl.update
);
router.patch(
  "/:resumeId/swap",
  [RateLimit(25), Auth, Validator(LangsValidations.swap())],
  LangsCtrl.swap
);
router.delete("/:resumeId/:langId", [RateLimit(25), Auth], LangsCtrl.delete);

module.exports = router;
