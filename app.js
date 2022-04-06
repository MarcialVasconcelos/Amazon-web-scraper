const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./src/router");

app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

app.use(express.json())
app.use(router)

const port = 2500
const url = `http://localhost:${port}`
app.listen(port, () => console.log(`Server is running at: ${url}`));