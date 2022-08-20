const mongoose = require('mongoose')

const Schema  = mongoose.Schema

const MessageSchema = new Schema({
    name: String
})

const modelMessage = mongoose.model('User', MessageSchema)

module.exports = modelMessage