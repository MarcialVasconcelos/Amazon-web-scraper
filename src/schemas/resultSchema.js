const mongoose = require('mongoose')

const resultSchema = mongoose.Schema({
    date: {
        type: String
    },
    time: {
        type: String
    },
    productID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        required: true
    },
    price: {
        type: Number
    },
    reviews: {
        type: Number
    },
    stars: {
        type: Number
    },
    prime: {
        type: Boolean
    },
});

module.exports = resultSchema