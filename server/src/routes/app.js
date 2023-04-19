// Import library
const express = require('express');

// Import components
const userMiddlewares = require('../middlewares/user');
const postMiddlewares = require('../middlewares/post');

// Define router
const router = express.Router();

// Define routes
router.get('/', userMiddlewares.index, postMiddlewares.index);

module.exports = router;
