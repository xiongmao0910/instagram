// Import library

// Import components
const Post = require('../models/post');

class PostController {
    // [POST] -> path: /post/create
    async create(req, res) {
        // * Get data from client
        const { media, caption, userId } = req.body;

        // * Save data to database
        const newPost = new Post({ media, caption, userId });

        try {
            await newPost.save();

            return res.status(201).json({
                success: true,
                msg: 'Tạo bài viết thành công!',
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: 'Lỗi không thể tạo bài viết!',
            });
        }
    }
}

module.exports = new PostController();
