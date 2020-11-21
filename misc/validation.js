const joi = require("@hapi/joi")


const registerValidation = (data) => {
    const schema = joi.object({
        username: joi.string().min(5).required(),
        email: joi.string().min(5).required().email(),
        password: joi.string().min(5).required()
    })

    return schema.validate(data);

}

const loginValidation = (data) => {
    const schema = joi.object({
        email: joi.string().min(5).required().email(),
        password: joi.string().min(5).required()
    })

    return schema.validate(data);

}


module.exports.loginValidation = loginValidation;
module.exports.registerValidation = registerValidation;