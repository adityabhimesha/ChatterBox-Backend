const express = require("express")
const router = express.Router();
const User = require("../model/User");
const verify = require('./verifyToken')
const multer = require("multer");
const path = require("path")
const fs = require('fs')
const moment = require("moment")



const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        var name = file.originalname.split(".")
        cb(null, name.splice(0, (name.length - 1)).join(".") + '-' + Date.now() + path.extname(file.originalname));
    }
});

//Init Upload
const upload = multer({
    storage: storage
}).single('VideoIdTag'); // name of input tag IMPORTANT


router.get('/all', verify, async(req, res) => {
    user = req.user
    const payload = [];
    var users = await User.find().sort({ date: 1 })
    users.forEach((user) => {
        if (user.video_link != "") {
            payload.push({
                "username": user.username,
                "video_link": user.video_link
            })
        }
    })
    if (payload.length) {
        res.send(payload)
    } else {
        res.status(200).send("No Stories Available")
    }
})

//home
router.post('/upload', verify, async(req, res) => {

    user = req.user;
    if (user.video_link != "") {
        res.status(401).send("Story already present, Please Delete and Try Again!")
    } else {
        upload(req, res, (err) => {
            if (err) {
                console.log("This is file storage error", err)
                res.status(500).send("Upload Failed, Try Again!")
            } else {
                user.video_link = req.file.path
                user.date = moment().add(10, 'm');
                user.save()
                res.status(200).send("Story Uploaded Successfully!")
            }
        });
    }

})

router.delete('/delete', verify, async(req, res) => {

    user = req.user;
    if (user.video_link != "") {
        fs.unlink(user.video_link, (err) => {
            if (err) {
                console.log(err)
            }
        })
        user.video_link = ""
        user.save();
        res.send("Story was deleted successfully!")

    } else {
        return res.status(401).send("No Video Present, Please Upload!")
    }
});

module.exports = router;