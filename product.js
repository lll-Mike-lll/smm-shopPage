const mongoose = require('mongoose')
const Schema = mongoose.Schema
const productSchema = new Schema({
    product_name: String,
    category: String,
    price: Number,
    qty: Number,
    image: String,
    store_name: String
})
const ProductModel = mongoose.model('SMM_shop', productSchema)
module.exports = ProductModel


// name: String,
// category: String,
// price: Number,
// image: String,
// shop_id: String,
// shop_name: String,
// tags: [String]