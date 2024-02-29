const express = require("express");
const adminController = require("../controller/admin.ts");
const router = express.Router();
const validator = require("../middleware/validator.ts");
const schema = require("../schema/requestSchema.ts");
const auth = require("../middleware/auth.ts");

router.get("/", (req, res) => {
  console.log("Welcome to the admin API");
  res.send("Welcome to the admin API");
});

router.get("/grocery", auth.adminAuth, adminController.getGroceries);
router.post(
  "/grocery",
  auth.adminAuth,
  validator.reqValidator(schema.createGrocery),
  adminController.addGrocery
);
router.put(
  "/grocery/:id",
  auth.adminAuth,
  validator.reqValidator(schema.updateGrocery),
  adminController.updateGrocery
);
router.delete("/grocery/:id", auth.adminAuth, adminController.deleteGrocery);
router.put("/updateOrder/:id", auth.adminAuth, adminController.updateOrder);
router.get("/order", auth.adminAuth, adminController.getOrders);

module.exports = router;
