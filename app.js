const express = require("express");
const app = express();
const router = require("./src/router");

const port = 2500;
const url = `http://localhost:${port}`

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server is running at: ${url}`);
});