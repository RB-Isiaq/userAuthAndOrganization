const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares");
const {
  getUserOrganisations,
  createOrganisation,
  getOrganisationById,
  addUserToOrganisation,
} = require("../controllers/organisation");

router.use(authMiddleware);

router.get("/:orgId", getOrganisationById);
router.post("/:orgId/users", addUserToOrganisation);
router.get("/", getUserOrganisations);
router.post("/", createOrganisation);

module.exports = router;
