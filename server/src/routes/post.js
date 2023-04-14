// Import library
const express = require('express');

// Import components
const postController = require('../controllers/post');

// Define router
const router = express.Router();

// Define routes
router.get('/get-all/:userId', postController.index);
router.get('/get/:id', postController.get);
router.post('/create', postController.create);

module.exports = router;
