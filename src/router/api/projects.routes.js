const express = require("express");
const router = express.Router();

const RateLimit = require("../../middlewares/RateLimit");
const Auth = require("../../middlewares/Auth");
const ProjectsCtrl = require("../../controllers/projects");
const ProjectsValidations = require("../../validations/projects");
const Validator = require("../../middlewares/Validator");

router.post(
  "/:resumeId",
  [RateLimit(25), Auth, Validator(ProjectsValidations.create())],
  ProjectsCtrl.create
);
router.get("/:resumeId/list", [Auth], ProjectsCtrl.list);
router.get("/:resumeId/:projectId", [Auth], ProjectsCtrl.detail);
router.put(
  "/:resumeId/:projectId",
  [RateLimit(25), Auth, Validator(ProjectsValidations.update())],
  ProjectsCtrl.update
);
router.patch(
  "/:resumeId/swap",
  [RateLimit(25), Auth, Validator(ProjectsValidations.swap())],
  ProjectsCtrl.swap
);
router.delete(
  "/:resumeId/:projectId",
  [RateLimit(25), Auth],
  ProjectsCtrl.delete
);

module.exports = router;
