const express = require("express");
const passport = require("passport");
const authorizeRoles = require("../../middlewares/role.middleware");
const logController = require("./log.controller");

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));
router.use(authorizeRoles("ADMIN"));

router.post("/", logController.createLog);
router.get("/", logController.getAllLogs);
router.get("/user/:userId", logController.getUserLogs);
router.get("/:id", logController.getLogById);
router.delete("/cleanup", logController.deleteOldLogs);

module.exports = router;