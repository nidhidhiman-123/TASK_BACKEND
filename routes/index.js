const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');
const userController = require('../controllers/userController')



router.post('/login', loginController.login);
router.post('/signup', userController.newUser);
router.post('/video', loginController.video);

module.exports = router;

