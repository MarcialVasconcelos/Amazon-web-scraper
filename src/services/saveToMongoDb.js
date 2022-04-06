const Results = require("../model/results")

async function saveToMongoDb(product) {
    const dateNow = new Date()

    const { name, productID, price, reviews, stars, prime, link, image } = product


    return Results.create({
        name,
        productID,
        price,
        reviews,
        stars,
        prime,
        link,
        image,
        date: dateNow.toLocaleDateString("pt-br"),
        time: dateNow.toLocaleTimeString("pt-br"),
    });
}

module.exports = saveToMongoDb