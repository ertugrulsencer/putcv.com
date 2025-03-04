const express = require("express");
const router = express.Router();

const RateLimit = require("../../middlewares/RateLimit");
const Auth = require("../../middlewares/Auth");
const ReferencesCtrl = require("../../controllers/references");
const ReferencesValidations = require("../../validations/references");
const Validator = require("../../middlewares/Validator");

router.post(
  "/:resumeId",
  [RateLimit(25), Auth, Validator(ReferencesValidations.create())],
  ReferencesCtrl.create
);
router.get("/:resumeId/list", [Auth], ReferencesCtrl.list);
router.get("/:resumeId/:referenceId", [Auth], ReferencesCtrl.detail);
router.put(
  "/:resumeId/:referenceId",
  [RateLimit(25), Auth, Validator(ReferencesValidations.update())],
  ReferencesCtrl.update
);
router.patch(
  "/:resumeId/swap",
  [RateLimit(25), Auth, Validator(ReferencesValidations.swap())],
  ReferencesCtrl.swap
);
router.delete(
  "/:resumeId/:referenceId",
  [RateLimit(25), Auth],
  ReferencesCtrl.delete
);

module.exports = router;
