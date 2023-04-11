// Import library
const express = require('express');

// Import components
const userController = require('../controllers/user');

// Define router
const router = express.Router();

// Define routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh', userController.refreshToken);

module.exports = router;
