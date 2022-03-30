const mongoose = require('mongoose')

const ResultSchema = mongoose.Schema({
    // _id:,
    Date: String,
    Product: String,
    Quantity: Number,
    Results: Array,
});

let Model = mongoose.model('Results', ResultSchema)

function send2DB (req, responseData) {
    const DBresults = new Model({
        Date: new Date().toLocaleString("pt-br"),
        Product: req.body.product,
        Quantity: req.body.quantity,
        Results: responseData.data
    })
    DBresults.save()
    // .then(res => console.log(res))
    .catch(err => console.error(err))
    return
}

module.exports = send2DB