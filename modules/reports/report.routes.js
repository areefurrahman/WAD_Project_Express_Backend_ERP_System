const express = require("express");
const passport = require("passport");
const reportController = require("./report.controller");

const router = express.Router();

router.get(
  "/sales/daily",
  passport.authenticate("jwt", { session: false }),
  reportController.dailySales
);

router.get(
  "/sales/monthly",
  passport.authenticate("jwt", { session: false }),
  reportController.monthlySales
);

router.get(
  "/top-products",
  passport.authenticate("jwt", { session: false }),
  reportController.topProducts
);

router.get(
  "/customer-sales",
  passport.authenticate("jwt", { session: false }),
  reportController.customerSales
);

module.exports = router;
