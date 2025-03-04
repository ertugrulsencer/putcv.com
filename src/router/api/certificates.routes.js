const express = require("express");
const router = express.Router();

const RateLimit = require("../../middlewares/RateLimit");
const Auth = require("../../middlewares/Auth");
const CertificatesCtrl = require("../../controllers/certificates");
const CertificatesValidations = require("../../validations/certificates");
const Validator = require("../../middlewares/Validator");

router.post(
  "/:resumeId",
  [RateLimit(25), Auth, Validator(CertificatesValidations.create())],
  CertificatesCtrl.create
);
router.get("/:resumeId/list", [Auth], CertificatesCtrl.list);
router.get("/:resumeId/:certificateId", [Auth], CertificatesCtrl.detail);
router.put(
  "/:resumeId/:certificateId",
  [RateLimit(25), Auth, Validator(CertificatesValidations.update())],
  CertificatesCtrl.update
);
router.patch(
  "/:resumeId/swap",
  [RateLimit(25), Auth, Validator(CertificatesValidations.swap())],
  CertificatesCtrl.swap
);
router.delete(
  "/:resumeId/:certificateId",
  [RateLimit(25), Auth],
  CertificatesCtrl.delete
);

module.exports = router;
