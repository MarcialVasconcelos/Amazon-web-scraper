const express = require("express");
const router = express.Router();
const Controller = require("./controller");

router.post("/", Controller.onGet);

router.all("/", (req, res) => {
  res.send("Use POST method to send a request");
});

module.exports = router;