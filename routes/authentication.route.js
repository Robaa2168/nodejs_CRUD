const express = require('express');
const router = express.Router();

const authentication_controller = require('../controllers/authentication.controller');

router.post('/signup', authentication_controller.signup);
router.post('/login', authentication_controller.login);
router.get('/loginhtml', authentication_controller.loginhtml);
router.get('/signuphtml', authentication_controller.signuphtml);

router.get('/logout', authentication_controller.logout);



module.exports = router;