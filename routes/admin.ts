const express = require("express");
const adminController = require("../controller/admin.ts");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("Welcome to the admin API");
  res.send("Welcome to the admin API");
});

router.get("/getGroceries", adminController.getGroceries);
router.post("/addGrocery", adminController.addGrocery);
module.exports = router;
