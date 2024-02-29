const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.ts");
const userController = require("../controller/user.ts");
const validator = require("../middleware/validator.ts");
const schema = require("../schema/requestSchema.ts");

router.get("/", (req, res) => {
  console.log("Welcome to the user API");
  res.send("Welcome to the user API");
});
router.get("/grocery", auth.userAuth, userController.getGroceries);
router.post(
  "/order",
  auth.userAuth,
  validator.reqValidator(schema.placeOrder),
  userController.placeOrder
);
router.get(
  "/myOrder",
  auth.userAuth,
  userController.myOrder
);

module.exports = router;
