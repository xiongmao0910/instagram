// Import library
const express = require('express');

// Import components
const userController = require('../controllers/user');

// Define router
const router = express.Router();

// Define routes
router.post('/', userController.index);
router.get('/get/:username', userController.get);
router.get('/get-follower/:username', userController.getFollower);
router.get('/get-following/:username', userController.getFollowing);
router.put('/follow', userController.follow);
router.put('/unfollow', userController.unfollow);
router.put('/update', userController.update);

module.exports = router;
