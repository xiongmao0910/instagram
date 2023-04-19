// Import components
const User = require('../models/user');

class UserMiddlewares {
    async index(req, res, next) {
        const { currentuserid } = req.headers;

        try {
            const user = await User.findOne({ _id: currentuserid }).populate(
                'following'
            );

            if (!user) {
                return res.status(200).json({
                    success: true,
                    data: {
                        data: [],
                    },
                });
            }

            const followings = user.following.map((user) => {
                return {
                    id: user._id,
                    username: user.username,
                    photoURL: user.photoURL,
                };
            });

            req.uid = currentuserid;
            req.followings = followings;

            next();
        } catch (error) {
            return res
                .status(401)
                .json({ success: false, msg: 'Có lỗi gì đó...!' });
        }
    }
}

module.exports = new UserMiddlewares();
