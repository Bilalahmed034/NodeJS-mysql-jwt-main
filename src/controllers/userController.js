const db = require("../models");
const {
    hash: hashPassword,
    compare: comparePassword,
} = require('../utils/password')
const { generate: generateToken } = require('../utils/token')
const sendMessage = require('../../helpers/send_message')
const sendEmail = require('../../helpers/send-email')
const SenderOffer = db.senderOffer;
const TravelerOffer = db.travlerOffer;
const Support = db.support;
const Rating = db.ratings;
const TopDestination = db.topDestinations;
const AcceptedTravelerOffer = db.acceptedTravelerOffer;
const AcceptedSenderOffer = db.acceptedSenderOffer;
var User = db.user;
var ForGotPassword = db.forGotPassword;
var signup = (req, res) => {
    var topDestinationCountries = req.body.topDestinationCountries;
    const { firstName, lastName, email, password, phone_no, gender, date_of_birth, country, initialRole } = req.body
    const hashedPassword = hashPassword(password.trim())
    User.create({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password: hashedPassword, phone_no: phone_no, gender: gender, date_of_birth: date_of_birth, country: country, device_token: req.body?.device_token, initial_role: initialRole }).then((data) => {
        topDestinationCountries.user_id = data.id;
        User.findOne({
            where: {
                id: data.id
            }
        }).then((user) => {
            TopDestination.create(topDestinationCountries);
            const token = generateToken(user.id)
            user.password = undefined;
            res.status(200).send({
                status: true,
                token: token,
                user,
            })
        }).catch((error) => {
            res.status(200).send({
                status: false,
                message: "Registraton Failed",
                error
            })
        })

    }).catch((error) => {
        res.status(200).send({
            status: false,
            message: "Registraton Failed",
            error
        })
    })

}
var signin = async (req, res) => {
    const { email, password } = req.body;
    User.findOne({
        where: {
            email: email
        },
        include:[TopDestination]
    }).then((data) => {

        if (data) {
            data.update({
                last_login_date: new Date(),
                device_token: req.body?.device_token
            }).then((user) => {
                // console.log(user.password + " _____password " + password.trim())
                if (comparePassword(password.trim(), user.password)) {
                    // console.log(user)
                    user.password = undefined;
                    const token = generateToken(user.id)
                    if (user.status) {
                        res.status(200).send({
                            status: true,
                            token: token,
                            user
                        })
                    } else {
                        res.status(200).send({
                            status: false,
                            message: "Your account has been suspended please contact support to get this resolved!"
                        })
                    }
                } else {
                    res.status(200).send({
                        status: false,
                        message: "password is incorrect"
                    })
                }
            }).catch((error) => {
                res.status(200).send({
                    status: false,
                    error
                })
            })
        } else {
            res.status(200).send({
                status: false,
                message: "Email does not exist!"

            })
        }
    }).catch((error) => {
        res.status(200).send({
            status: false,
            error
        })
    })

}
var getUser = async (req, res) => {
    User.findOne({ where: { id: req.body.id }}).then((user) => {
        user.password = undefined;
        res.status(200).send({
            status: true,
            user
        })
    }).catch(error => res.status(200).send({ status: false, error: error }))
}

var updateUser = async (req, res) => {
    const { id, firstname, lastname, email, phone_no, address } = req.body;
    var is_email_verified = 0;
    var is_phone_verified = 0;
    User.findOne({ where: { id: req.body.id } }).then((user) => {
        if (user) {
            is_email_verified = user.is_email_verified || 0;
            if (user.email != req.body.email) {
                is_email_verified = 0;
            }
            is_phone_verified = user.is_phone_verified || 0;
            if (user.phone_no != req.body.phone_no) {
                is_phone_verified = 0;
            }
            user.update({
                firstName: firstname,
                lastName: lastname,
                email: email,
                phone_no, phone_no, address: address,
                gender: req.body.gender,
                country: req.body.country
            }).then((updatedUser) => {
                updatedUser.password = undefined;
                res.status(200).send({
                    status: true,
                    updatedUser
                })
            }).catch(error => res.status(200).send({ status: false, error: error }))

        }
    }).catch(error => res.status(200).send({ status: false, error: error }))
}

var resetPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    User.findOne({ where: { id: req.body.id } }).then((user) => {
        if (user) {
            if (comparePassword(oldPassword.trim(), user.password)) {
                const hashedPassword = hashPassword(newPassword.trim())
                user.update({
                    password: hashedPassword
                }).then((updatedUser) => {
                    updatedUser.password = undefined;
                    res.status(200).send({
                        status: true,
                        message: "Password updated successfully!"
                    })
                }).catch(error => res.status(200).send({ status: false, error }))
            } else {
                res.status(200).send({
                    status: false,
                    message: "Password is incorrect!"
                })
            }

        }
    }).catch(error => res.status(200).send({ status: false, error }))
}

var forgotPasswordSendOtp = async (req, res) => {
    if (req.body.phone_no) {
        ForGotPassword.findOne({
            where: {
                username: req.body.phone_no
            }
        }).then((otpData => {
            // console.log(otpData)
            if (otpData) {
                ForGotPassword.destroy({
                    where: {
                        id: otpData.id
                    }
                }).then(() => {
                    User.findOne({
                        where: {
                            phone_no: req.body.phone_no
                        }
                    }).then(async (user) => {
                        if (user) {
                            var phone_no = req.body.phone_no
                            var otp = Math.floor(Math.random() * 90000) + 10000
                            var message = 'Verify your phone number with your one-time-passport ' + otp + ' and let the Viahop journey begin!'
                            await sendMessage(message, phone_no, otp)
                            ForGotPassword.create({
                                username: phone_no,
                                otp: otp
                            }).then(() => {
                                res.status(200).send({
                                    status: true,
                                    message: "otp has been sent your phone number!"
                                })
                            })

                        } else {
                            res.status(200).send({
                                status: true,
                                message: "Phone number not found"
                            })
                        }
                    })
                })
            } else {
                User.findOne({
                    where: {
                        phone_no: req.body.phone_no
                    }
                }).then(async (user) => {
                    if (user) {
                        var phone_no = req.body.phone_no
                        var otp = Math.floor(Math.random() * 90000) + 10000
                        var message = 'Verify your phone number with your one-time-passport ' + otp + ' and let the Viahop journey begin!'
                        await sendMessage(message, phone_no, otp)
                        ForGotPassword.create({
                            username: phone_no,
                            otp: otp
                        }).then(() => {
                            res.status(200).send({
                                status: true,
                                message: "otp has been sent your phone number!"
                            })
                        })

                    } else {
                        res.status(200).send({
                            status: false,
                            message: "Phone number not found"
                        })
                    }
                })
            }

        }))
    }

}

var forgotPasswordVerifyOtp = async (req, res) => {
    ForGotPassword.findOne({
        where: {
            otp: req.body.otp
        }
    }).then((otpData) => {
        if (otpData) {
            User.findOne({
                where: {
                    phone_no: otpData.username
                }
            }).then((user) => {
                if (user) {
                    var generatedTempPassword = ""

                    var chars =
                        '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                    var generatedTempPasswordLength = 8

                    for (var i = 0; i <= generatedTempPasswordLength; i++) {
                        var randomNumber = Math.floor(Math.random() * chars.length)
                        generatedTempPassword += chars.substring(
                            randomNumber,
                            randomNumber + 1,
                        )
                    }
                    // console.log(generatedTempPassword)
                    const hashedPassword = hashPassword(generatedTempPassword)
                    // console.log(hashedPassword)
                    user.update({
                        password: hashedPassword
                    }).then(async () => {
                        if (req.body.lang == "rs") {
                            await sendEmail({
                                to: user.email,
                                subject: 'Reset Forgot Password ',
                                html: `<h4>Сбросить забытый пароль</h4>
                                <div style="white-space:nowrap">Dear <b>${user.firstName} ${user.lastName},</b></div>
                                     <p>Мы отправили вам временный пароль. Используйте этот пароль для входа и сброса пароля.</p>
                                     <p>Ваш временный пароль выглядит следующим образом!</p>
                                     ${generatedTempPassword}`,
                            })
                        } else {
                            await sendEmail({

                                to: user.email,
                                subject: 'Reset Forgot Password ',
                                html: `<h4>Reset Forgot Password</h4>
                                <div style="white-space:nowrap">Dear <b>${user.firstName} ${user.lastName},</b></div>
                                     <p>We have sent you a temporary password use this password to login and reset your password</p>
                                     <p>Your temporary Password is as follow!</p>
                                     ${generatedTempPassword}`,
                            })
                        }


                        ForGotPassword.destroy({
                            where: {
                                id: otpData.id
                            }
                        }).then(() => {
                            res.status(200).send({
                                status: 'true',
                                message:
                                    'A temporary password is sent to your email address please login and reset your Password.',
                                email: user.email,
                            })
                        }).catch((error) => res.status(200).send({
                            status: false,
                            error
                        }))
                    }).catch((error) => res.status(200).send({
                        status: false,
                        error
                    }))
                } else {
                    res.status(200).send({
                        status: false,
                        message: "User not found!!!"
                    })
                }

            }).catch((error) => res.status(200).send({
                status: false,
                error
            }))
        } else {
            res.status(200).send({
                status: false,
                message: "Invalid OTP"
            })
        }
    })
}


var uploadImage = (req, res) => {
    User.findOne({
        where: {
            id: req.body.id
        }
    }).then((user) => {
        user.update({
            image: req.body.imageUrl
        }).then((updateUser) => {
            res.status(200).send({
                status: true,
                user: { ...updateUser.dataValues }
            })
        }).catch((error) => res.status(200).send({
            status: false,
            error
        }))
    }).catch((error) => res.status(200).send({
        status: false,
        error
    }))
}
var uploadVerificationImage = (req, res) => {
    User.findOne({
        where: {
            id: req.body.id
        }
    }).then((user) => {
        user.update({
            id_image: req.body.imageUrl
        }).then((updateUser) => {
            res.status(200).send({
                status: true,
                user: { ...updateUser.dataValues }
            })
        }).catch((error) => res.status(200).send({
            status: false,
            error
        }))
    }).catch((error) => res.status(200).send({
        status: false,
        error
    }))
}

//Offer status update api

var createSupportMessage = (req, res) => {
    Support.create({
        full_name: req.body.fullName,
        email: req.body.email,
        message: req.body.message
    }).then((data) => {
        res.status(200).send({
            status: true,
            message: "Message sent successfully"
        })
    }).catch((error) => {
        res.status(200).send({
            status: false,
            error: error
        })
    })
}



var updateUserStatus = (req, res) => {
    var currentStatus = req.body.currentStatus;
    var newStatus = 0;
    if (currentStatus == 1) {
        newStatus = 0
    } else {
        newStatus = 1
    }
    User.findOne({
        where: {
            id: req.body.userId
        }
    }).then((user) => {
        user.update({
            status: newStatus
        }).then((updatedUser) => {
            res.status(200).send({
                status: true,
                message: 'User Status Updated Successfullyy',
                updatedUser
            })
        }).catch((error) => {
            res.status(200).send({
                status: false,
                error
            })
        })
    }).catch((error) => {
        res.status(200).send({
            status: false,
            error
        })
    })
}
module.exports = {
    signup,
    signin,
    updateUser,
    getUser,
    resetPassword,
    forgotPasswordSendOtp,
    forgotPasswordVerifyOtp,
    uploadVerificationImage,
    uploadImage,
    createSupportMessage,
    updateUserStatus
}