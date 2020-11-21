const jwt = require("jsonwebtoken")
const User = require("../model/User");

module.exports = async function(req, res, next) {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send("Access Denied, Please Login");
    }
    try {
        const verifiedToken = jwt.verify(token, process.env.TOKEN_SECRET)
        const user = await User.findOne({
            _id: verifiedToken._id
        })
        if (!user) {
            return res.status(400).send("Invalid User, Please Login");
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(400).send("Invalid Token, Please Login");
    }
}