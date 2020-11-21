const express = require("express")
const router = express.Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../misc/validation")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const verify = require('./verifyToken')


//LOGIN
router.post('/login', async(req, res) => {
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send("Enter a Valid Email or Password(min 5 characters)")
    }
    const user = await User.findOne({
        email: req.body.email
    })
    if (user) {
        const validpass = await bcrypt.compare(req.body.password, user.password);
        if (!validpass) {
            return res.status(400).send("Email or Password is Incorrect! Try Again.")
        } else {
            //login success
            const token = jwt.sign({ _id: user._id, user: user.username }, process.env.TOKEN_SECRET)
            res.header("Access-Control-Expose-Headers", "auth-token");
            res.header('auth-token', token)
            return res.send({
                name: user.username,
                id: user._id
            })
        }

    } else {
        return res.status(400).send("Email or Password is Incorrect! Try Again.")
    }
})


//REGISTER
router.post('/register', async(req, res) => {

    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send("Please Check either Username/Email/Password(min 5 characters)")
    }

    //check user if present
    const userExists = await User.findOne({
        email: req.body.email
    })
    if (userExists) {
        return res.status(400).send("User has an account already, Please Login!")
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);


    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashpassword
    });
    try {
        const savedUser = await user.save();
        const token = jwt.sign({ _id: savedUser._id, user: savedUser.username }, process.env.TOKEN_SECRET)
        res.header("Access-Control-Expose-Headers", "auth-token");
        res.header('auth-token', token)
        return res.send({
            name: user.username,
            id: user._id
        })
    } catch (err) {
        res.status(400).send("We encountered an error, Try Again!")
    }
})

router.get('/logout', verify, (req, res) => {
    //clear out the auth token generated

    res.send("Logout Successful!, clear auth token")

})


module.exports = router;