const mongoose = require('mongoose')

const ResultSchema = mongoose.Schema({
    date: String,
    time: String,
    productID: String,
    name: String,
    image: String,
    link: String,
    price: Number,
    reviews: Number,
    stars: Number,
    prime: Boolean,
});

let Model = mongoose.model('Results', ResultSchema)

function send2DB (product) {
    const now = new Date()
    const DBresults = new Model({
        date: now.toLocaleDateString("pt-br"),
        time: now.toLocaleTimeString("pt-br"),
        productID: product.productID,
        name: product.name,
        image: product.image,
        link: product.link,
        price: product.price,
        reviews: product.reviews,
        stars: product.stars,
        prime: product.prime
    })
    DBresults.save()
    // .then(res => console.log(res))
    .catch(err => console.error(err))
    return
}

module.exports = send2DB