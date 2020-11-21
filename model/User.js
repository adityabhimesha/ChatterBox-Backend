const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 5,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 5,
        max: 255
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 5
    },
    date: {
        type: Date,
        default: Date.now,
    },
    video_link: {
        type: String,
        default: "",
        max: 255,
    }

})

module.exports = mongoose.model("User", userSchema)