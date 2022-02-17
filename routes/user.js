const express = require('express');
const router = express.Router();
const usercontroller = require('../controller/usercontroller');


router.post('/signup', usercontroller.signup_user);
router.post('/login', usercontroller.login_user);
router.post('/forgetpassword', usercontroller.forget_password);
router.post('/resetpassword', usercontroller.reset_password);


module.exports = router;