var cron = require('cron');
const User = require("../model/User");
const moment = require("moment")
const fs = require("fs")


//runs every 10 minutes to delete stories
exports.cronJob = cron.job("0 */5 * * * *", async function() {
    // perform operation e.g. GET request http.get() etc.
    const users = await User.find();
    users.forEach((user) => {
        if (user.video_link != '') {
            if (moment().unix() > moment(user.date).unix()) {
                fs.unlink("public/uploads/" + user.video_link, (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
                user.video_link = ""
                user.save();
            }
        }
    })
    console.log('CronJob completed');
});