const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
        max: 1024,
    },
    date: {
        type: Date,
        default: Date.now,
        expires: 3600
    },

})

module.exports = mongoose.model("Message", messageSchema)