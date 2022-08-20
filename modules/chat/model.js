const mongoose = require('mongoose')

const Schema  = mongoose.Schema

const MessageSchema = new Schema({
    user: [{
        type: Schema.ObjectId,
        ref: 'User',}
    ]
})

const modelMessage = mongoose.model('Messages', MessageSchema)

module.exports = modelMessage