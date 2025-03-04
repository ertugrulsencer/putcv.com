const express = require("express");
const router = express.Router();

const RateLimit = require("../../middlewares/RateLimit");
const Auth = require("../../middlewares/Auth");
const CoverLettersCtrl = require("../../controllers/cover_letters");
const CoverLettersValidations = require("../../validations/cover_letters");
const Validator = require("../../middlewares/Validator");

router.post(
  "/create",
  [RateLimit(5), Auth, Validator(CoverLettersValidations.create())],
  CoverLettersCtrl.create
);
router.get("/list", [Auth], CoverLettersCtrl.list);
router.get("/:coverLetterId", [Auth], CoverLettersCtrl.detail);
router.put(
  "/:coverLetterId",
  [RateLimit(25), Auth, Validator(CoverLettersValidations.update())],
  CoverLettersCtrl.update
);
router.delete(
  "/:coverLetterId",
  [RateLimit(25), Auth],
  CoverLettersCtrl.delete
);

module.exports = router;
