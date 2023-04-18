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
            const postsArr = await Post.find({ userId }, '-__v').sort({
                createdAt: -1,
            });

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
            const commentsList = await Comment.find({ postId: id }).populate(
                'userId'
            );

            const comments = commentsList.map((comment) => {
                return {
                    id: comment._id,
                    description: comment.description,
                    username: comment.userId.username,
                    userPhotoURL: comment.userId.photoURL,
                };
            });

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

    // [POST] -> path: /post/like
    async like(req, res) {
        // * Get data from client
        const { userId, postId } = req.body;

        // * Save list user like a post to db
        try {
            const post = await Post.findOneAndUpdate(
                { _id: postId },
                {
                    $push: { likes: userId },
                },
                { new: true }
            );

            return res.status(201).json({
                success: true,
                msg: 'Bạn đã thích bài viết',
                data: {
                    likeCount: post.likes.length,
                    isLiked: true,
                },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: 'Lỗi không thể thích bài viết!',
            });
        }
    }

    // [POST] -> path: /post/unlike
    async unlike(req, res) {
        // * Get data from client
        const { userId, postId } = req.body;

        // * Save list user like a post to db
        try {
            const post = await Post.findOneAndUpdate(
                { _id: postId },
                {
                    $pull: { likes: userId },
                },
                { new: true }
            );

            return res.status(201).json({
                success: true,
                msg: 'Bạn đã bỏ thích bài viết',
                data: {
                    likeCount: post.likes.length,
                    isLiked: false,
                },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: 'Lỗi không thể bỏ thích bài viết!',
            });
        }
    }

    // [POST] -> path: /post/comment
    async comment(req, res) {
        // * Get data from client
        const { postId, userId, description } = req.body;

        try {
            const newComment = new Comment({ description, postId, userId });
            await newComment.save();
            const comment = await newComment.populate('userId');

            const data = {
                id: comment._id,
                description: comment.description,
                username: comment.userId.username,
                userPhotoURL: comment.userId.photoURL,
            };

            return res.status(201).json({
                success: true,
                msg: 'Bạn đã bình luận bài viết',
                data,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: 'Lỗi không thể bình luận bài viết!',
            });
        }
    }

    // [GET] -> path: /post/list-like/:postId
    async getListLike(req, res) {
        // * Get post id from params
        const { postId } = req.params;

        try {
            // * Get post
            const post = await Post.findById(postId).populate('likes');

            const likes = post.likes.map((like) => {
                return {
                    id: like._id,
                    fullname: like.fullname,
                    username: like.username,
                    photoURL: like.photoURL,
                };
            });

            // * Return data to client
            return res.status(200).json({
                success: true,
                data: {
                    likes,
                },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: 'Lỗi không thể lấy dữ liệu bài viết!',
            });
        }
    }

    // [PUT] -> /post/edit/:postId
    async edit(req, res) {
        // * Get data from client
        const { id, ...data } = req.body;

        const dataUpdate = { ...data };

        try {
            await Post.findOneAndUpdate({ _id: id }, dataUpdate);

            return res.status(201).json({
                success: true,
                msg: 'Bài viết đã được cập nhật!',
            });
        } catch (error) {
            return res.status(401).json({
                success: false,
                msg: 'Chỉnh sửa bài viết thất bại...!',
            });
        }
    }

    // [DELETE] -> /post/delete/:id
    async delete(req, res) {
        // * Get data from params
        const { id } = req.params;

        try {
            await Post.findOneAndDelete({ _id: id });
            await Comment.deleteMany({ postId: id });

            return res.status(201).json({
                success: true,
                msg: 'Bài viết đã được xóa!',
            });
        } catch (error) {
            return res.status(401).json({
                success: false,
                msg: 'Xóa bài viết thất bại...!',
            });
        }
    }
}

module.exports = new PostController();
