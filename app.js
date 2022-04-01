const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = require("./src/router");

const port = 2500
const url = `http://localhost:${port}`

app.use(express.json())
app.use(router)

mongoose.connect('mongodb://localhost:27017/amazon-scraper');

const db = mongoose.connection;
db.on( "error", () => console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Database Connection Successful!"));
 
app.listen(port, () => console.log(`Server is running at: ${url}`));