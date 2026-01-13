const express = require("express");
const passport = require("passport");
const authorizeRoles = require("../../middlewares/role.middleware");
const controller = require("./stock.controller");

const router = express.Router();

router.use(
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("ADMIN")
);

router.post("/adjust", controller.adjustStock);
router.get("/logs", controller.getLogs);

module.exports = router;
