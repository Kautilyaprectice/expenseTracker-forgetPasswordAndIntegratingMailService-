const express = require('express');
const router = express.Router();
const forgetPasswordController = require('../controllers/forgetPassword');

router.post('/password/forgotpassword', forgetPasswordController.forgetPassword);

module.exports = router;
 