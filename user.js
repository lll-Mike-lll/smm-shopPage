const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    user: String,
    token: String
})
const UserModel = mongoose.model('usertest01', userSchema)
module.exports = UserModel


// name: String,
// category: String,
// price: Number,
// image: String,
// shop_id: String,
// shop_name: String,
// tags: [String]