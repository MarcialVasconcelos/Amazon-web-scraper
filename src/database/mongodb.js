const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/amazon-scraper');
let connection = null

class MongoDb {
    static createConnection() {
        return mongoose.createConnection(`mongodb://localhost:27017/amazon-scraper`)
    }

    static setEvents() {
        connection.on("error", () => console.error.bind(console, "connection error:"));
        connection.once("open", () => console.log("Database Connection Successful!"));
    }

    static getOrCreateConnection() {
        if (connection) {
            return connection
        }
        connection = this.createConnection()
        this.setEvents()
        return connection
    }
}


module.exports = MongoDb