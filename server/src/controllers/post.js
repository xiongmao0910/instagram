// Import library

// Import components
const Post = require('../models/post');
const Comment = require('../models/comment');

class PostController {
    // [GET] -> path: /post/get-all/:userId
    async index(req, res) {
        // * Get userId in params
        const { userId } = req.params;

        try {
            // * Get data from db
            const postsArr = await Post.find({ userId }, '-__v');

            const postsWithCommentCount = await Promise.all(
                [...postsArr].map(async (post) => {
                    const postComments = await Comment.find({
                        postId: post.id,
                    });

                    return {
                        ...post,
                        commentCount: postComments.length,
                    };
                })
            );

            const posts = postsWithCommentCount.map((post) => ({
                ...post._doc,
                likeCount: post._doc.likes.length,
                commentCount: post.commentCount,
            }));

            // * Return data to client
            return res.status(200).json({
                success: true,
                data: {
                    posts,
                    postCount: posts.length,
                },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: 'Lỗi không thể lấy dữ liệu tất cả bài viết!',
            });
        }
    }

    // [GET] -> path: /post/get/:id
    async get(req, res) {
        // * Get post id in params
        const { id } = req.params;

        const { currentuserid } = req.headers;

        try {
            // * Get post
            const post = await Post.findById(id).populate('userId');
            // * Get all comment of post
            const comments = await Comment.find({ postId: id }).populate(
                'userId'
            );

            const isLiked = post.likes.includes(currentuserid);

            // * Return data to client
            return res.status(200).json({
                success: true,
                data: {
                    _id: post._id,
                    media: post.media,
                    caption: post.caption,
                    likeCount: post.likes.length,
                    isLiked,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    username: post.userId.username,
                    userPhotoURL: post.userId.photoURL,
                    comments,
                },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: 'Lỗi không thể lấy dữ liệu bài viết!',
            });
        }
    }

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

// const posts = await Post.find({ userId }, '-__v').populate('userId');

module.exports = new PostController();
