const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const checkEmail = require('../middlewares/checkEmail');
const checkPhone = require('../middlewares/checkPhone');
const { signup: signupValidator, signin: signinValidator, email: verifyEmailValidator } = require('../validators/auth');

const authenticateToken = require('../middlewares/authenticate');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');

require('../models')
;
router.route('/signup')
    .post(asyncHandler(checkEmail), asyncHandler(checkPhone), asyncHandler(userController.signup));
router.route('/signin')
    .post(signinValidator, asyncHandler(userController.signin));
router.route('/get-user')
    .post(authenticateToken, asyncHandler(userController.getUser));
router.route('/update-user')
    .post(authenticateToken, asyncHandler(userController.updateUser));
router.route('/reset-password')
    .post(authenticateToken, asyncHandler(userController.resetPassword));
router.route('/forgot-password-send-otp')
    .post(asyncHandler(userController.forgotPasswordSendOtp));
router.route('/forgot-password-verify-otp')
    .post(asyncHandler(userController.forgotPasswordVerifyOtp));
router.route('/user-list')
    .get(authenticateToken, adminController.allUsers)
router.route('/update-user-status')
    .post(authenticateToken, userController.updateUserStatus)
router.route('/reset-user-password')
    .post(authenticateToken, asyncHandler(adminController.resetUserPassword));


//support message
router.route('/support-message')
    .post(userController.createSupportMessage);
router.route('/all-support-messages')
    .post(authenticateToken, adminController.supportMessages);


module.exports = router;