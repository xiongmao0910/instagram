// Import components
const Post = require('../models/post');

class PostMiddlewares {
    async index(req, res, next) {
        try {
            let data = [];

            await Promise.all(
                [...req.followings].map(async (following) => {
                    const postsData = await Post.find({ userId: following.id })
                        .sort({ createdAt: -1 })
                        .limit(2);

                    const posts = postsData.map((post) => {
                        const isLiked = post.likes.includes(req.uid);

                        return {
                            postId: post._id,
                            media: post.media,
                            caption: post.caption,
                            likeCount: post.likes.length,
                            createdAt: post.createdAt,
                            isLiked,
                            ...following,
                        };
                    });

                    data.push(...posts);
                })
            );

            return res.json({ success: true, data });
        } catch (error) {
            return res
                .status(401)
                .json({ success: false, msg: 'Có lỗi gì đó...!' });
        }
    }
}

module.exports = new PostMiddlewares();
