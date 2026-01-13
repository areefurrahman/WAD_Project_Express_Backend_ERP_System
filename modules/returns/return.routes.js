const express = require("express");
const passport = require("passport");
const authorizeRoles = require("../../middlewares/role.middleware");
const returnController = require("./return.controller");

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", returnController.createReturn);
router.get("/", returnController.getAllReturns);
router.get("/sale/:saleId", returnController.getReturnsBySale);
router.get("/:id", returnController.getReturnById);
router.delete("/:id", authorizeRoles("ADMIN"), returnController.deleteReturn);

module.exports = router;