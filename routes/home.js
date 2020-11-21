const express = require("express")
const router = express.Router();
const User = require("../model/User");
const Message = require("../model/Message");
const verify = require('./verifyToken')
const server = require("../server");

var connected_users = []

server.io.on('connection', (socket) => {
    console.log("New Connection")
    socket.db_id = socket.handshake.query._id
    socket.user_name = socket.handshake.query.username
    connected_users.push(socket)

    socket.on("receive_message", async(data) => {
        const new_message = new Message({
            sender: socket.user_name,
            from: socket.db_id,
            to: data.sender_id,
            content: data.content,
        })
        try {
            const savedMessage = await new_message.save();
            connected_users.every((user, index) => {
                if (user.db_id == savedMessage.to) {
                    console.log("sent message")
                    user.emit("sent_message", {
                        sender: savedMessage.sender,
                        from: savedMessage.from,
                        to: savedMessage.to,
                        content: savedMessage.content
                    });
                    return false
                } else return true
            })
        } catch (err) {
            console.log("error while saving", err);
        }
    })

    socket.on('disconnect', () => {
        connected_users.splice(connected_users.indexOf(socket), 1)
        console.log("user left!", connected_users.length)
    })
})

router.post('/chat/conversation', verify, async(req, res) => {
    user = req.body

    var messages = await Message.find({ from: { "$in": [user.from, user.to] }, to: { "$in": [user.from, user.to] } }).limit(16).sort({ date: 1 })
    console.log(messages.length)
    if (messages.length) {
        res.send(messages)
    } else {
        res.send("No Messages Available")
    }
})

router.get('/chat/users', verify, async(req, res) => {

    user = req.user
    const payload = [];
    var users = await User.find({ _id: { $ne: user._id } }).sort({ username: 1 })
    users.forEach((contact) => {
        payload.push({
            "username": contact.username,
            "_id": contact._id
        })
    })
    if (payload.length) {
        res.send(payload)
    } else {
        res.status(200).send("No Users Available")
    }

})

module.exports = router;