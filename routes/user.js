const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares");
const {
  getUser,
  deleteUser,
  getAllUsersInTheOrganisation,
} = require("../controllers/user");

router.use(authMiddleware);

router.get("/", getAllUsersInTheOrganisation);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);

module.exports = router;
