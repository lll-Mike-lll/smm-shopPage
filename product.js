const mongoose = require('mongoose')
const Schema = mongoose.Schema
const productSchema = new Schema({
    name: String,
    category: String,
    price: Number,
    image: String,
    owner: String
})
const ProductModel = mongoose.model('shoptest02_with_owner', productSchema)
module.exports = ProductModel


// name: String,
// category: String,
// price: Number,
// image: String,
// shop_id: String,
// shop_name: String,
// tags: [String]