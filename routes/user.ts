const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  console.log("Welcome to the user API");
  res.send("Welcome to the user API");
});
module.exports = router;
