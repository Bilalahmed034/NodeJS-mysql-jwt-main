const db = require('../models')
const User = db.user;
const checkPhone = (req, res, next) => {
    const { phone_no } = req.body;
    User.findOne({
        where: {
            phone_no: phone_no
        }
    }).then((user) => {
        if(user){
        res.status(200).send({
            status: false,
            message:"Phone number "+user.phone_no+" already exists "
        })}else{
            next();
        }
    }).catch((error) => res.status(200).send({
        status: false,
        error: error
    }))
    

}

module.exports = checkPhone;