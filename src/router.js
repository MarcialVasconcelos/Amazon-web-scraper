const express = require("express");
const router = express.Router();
const ResultsController = require("./controllers/resultsController");

router.post("/", ResultsController.onGet);

router.all("/", (req, res) => {
  res.status(403).send({
    message: "Use POST method to send a request"
  });
});

module.exports = router;