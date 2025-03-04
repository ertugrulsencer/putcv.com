const express = require("express");
const router = express.Router();

const account_routes = require("./account.routes");
const subscriptions_routes = require("./subscriptions.routes");
const templates_routes = require("./templates.routes");
const resume_routes = require("./resume.routes");
const personal_informations_routes = require("./personal_informations.routes");
const experiences_routes = require("./experiences.routes");
const educations_routes = require("./educations.routes");
const projects_routes = require("./projects.routes");
const references_routes = require("./references.routes");
const certificates_routes = require("./certificates.routes");
const skills_routes = require("./skills.routes");
const langs_routes = require("./langs.routes");
const cover_letters_routes = require("./cover_letters.routes");

router.use("/account", account_routes);
router.use("/subscriptions", subscriptions_routes);
router.use("/templates", templates_routes);
router.use("/resume", resume_routes);
router.use("/personal-informations", personal_informations_routes);
router.use("/experiences", experiences_routes);
router.use("/educations", educations_routes);
router.use("/projects", projects_routes);
router.use("/references", references_routes);
router.use("/certificates", certificates_routes);
router.use("/skills", skills_routes);
router.use("/langs", langs_routes);
router.use("/cover-letters", cover_letters_routes);

router.all("*", (req, res) =>
  res.status(404).json({
    code: 404,
    severity: "error",
    message: "Api endpoint not found.",
  })
);

module.exports = router;
