// Import library
const express = require('express');

// Import components
const postController = require('../controllers/post');

// Define router
const router = express.Router();

// Define routes
router.get('/get-all/:userId', postController.index);
router.get('/get/:id', postController.get);
router.get('/list-like/:postId', postController.getListLike);
router.post('/create', postController.create);
router.post('/like', postController.like);
router.post('/unlike', postController.unlike);
router.post('/comment', postController.comment);
router.put('/edit', postController.edit);
router.delete('/delete/:id', postController.delete);

module.exports = router;
