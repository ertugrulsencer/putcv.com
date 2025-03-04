const express = require("express");
const router = express.Router();

const RateLimit = require("../../middlewares/RateLimit");
const Auth = require("../../middlewares/Auth");
const ResumeCtrl = require("../../controllers/resume");
const ResumeValidations = require("../../validations/resume");
const Validator = require("../../middlewares/Validator");

router.post(
  "/create",
  [RateLimit(5), Auth, Validator(ResumeValidations.create())],
  ResumeCtrl.create
);
router.get("/list", [Auth], ResumeCtrl.list);
router.get("/:resumeId", [Auth], ResumeCtrl.detail);
router.put(
  "/:resumeId",
  [RateLimit(25), Auth, Validator(ResumeValidations.update())],
  ResumeCtrl.update
);
router.delete("/:resumeId", [RateLimit(25), Auth], ResumeCtrl.delete);

module.exports = router;
