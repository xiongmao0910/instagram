// Import library
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import components
const User = require('../models/user');

class UserController {
    // [POST] -> path: /user
    async index(req, res) {
        // * Get data from client
        const { token } = req.body;

        // * Verify token
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    return res.status(403).json({
                        success: false,
                        msg: 'Token không tồn tại',
                    });
                }

                // * Get user data
                const user = await User.findById(decoded._id);

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        msg: 'Không tìm thấy người dùng',
                    });
                }

                const isFollowedReq = user.followerReq.length ? true : false;

                const data = {
                    id: user._id,
                    fullname: user.fullname,
                    username: user.username,
                    email: user.email,
                    photoURL: user.photoURL,
                    bio: user.bio,
                    gender: user.gender,
                    private: user.private,
                    followerCount: user.follower.length,
                    followingCount: user.following.length,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    isFollowedReq,
                };

                // * Send data
                return res.status(200).json({
                    success: true,
                    data,
                });
            }
        );
    }

    // [POST] -> path: /auth/register
    async register(req, res) {
        // * Get data from client
        const data = req.body;

        // * Check username or email already exists
        const isUser = await User.findOne({ username: data.username });
        const isEmail = await User.findOne({ email: data.email });

        if (isUser) {
            return res.status(403).json({
                success: false,
                msg: 'Tên người dùng đã tồn tại',
            });
        }

        if (isEmail) {
            return res.status(403).json({
                success: false,
                msg: 'Địa chỉ email đã tồn tại',
            });
        }

        // * Hash password
        const hashPassword = await bcrypt.hash(data.password, 10);
        data.password = hashPassword;

        // * Save data to database
        const newUser = new User(data);

        try {
            await newUser.save();

            return res.status(201).json({
                success: true,
                msg: 'Tạo người dùng thành công!',
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                msg: 'Lỗi không thể tạo người dùng!',
            });
        }
    }

    // [POST] -> path: /auth/login
    async login(req, res) {
        // * Get data from client
        const { username, email, password } = req.body;

        // * Get option to get data from database
        let options = {};

        if (username) {
            options.username = username;
        }

        if (email) {
            options.email = email;
        }

        // * Check user already exists
        const user = await User.findOne(options);

        if (!user) {
            return res
                .status(401)
                .json({ success: false, msg: 'Người dùng không tồn tại!' });
        }

        // * Check password are matches
        const isMatches = await bcrypt.compare(password, user.password);

        if (!isMatches) {
            return res.status(401).json({
                success: false,
                msg: 'Email hoặc mật khẩu không chính xác!',
            });
        }

        // * Create access token
        const accessToken = jwt.sign(
            { _id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // * Create refresh token
        const refreshToken = jwt.sign(
            { _id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        const isFollowedReq = user.followerReq.length ? true : false;

        const data = {
            id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            photoURL: user.photoURL,
            bio: user.bio,
            gender: user.gender,
            private: user.private,
            followerCount: user.follower.length,
            followingCount: user.following.length,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isFollowedReq,
        };

        // * Send accessToken with user data
        return res.status(200).json({
            success: true,
            msg: 'Bạn đã đăng nhập thành công',
            token: accessToken,
            refreshToken,
            data,
        });
    }

    // [POST] -> path: /auth/refresh
    async refreshToken(req, res) {
        console.log('refreshing');

        // * Get data in cookie
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res
                .status(401)
                .json({ success: false, msg: 'Lỗi refresh token' });
        }

        // * Verify refreshToken
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err)
                    return res
                        .status(403)
                        .json({ success: false, msg: 'Lỗi refresh token' });

                // * Get user data
                const user = await User.findById(decoded._id);

                if (!user)
                    return res.status(401).json({
                        success: false,
                        msg: 'Không tìm thấy người dùng',
                    });

                // * Create new access token
                const newAccessToken = jwt.sign(
                    { _id: user._id },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1d' }
                );

                // * Create new refresh token
                const newRefreshToken = jwt.sign(
                    { _id: user._id },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '7d' }
                );

                console.log('refresh token done!');

                // * Send accessToken
                return res.json({
                    token: newAccessToken,
                    refreshToken: newRefreshToken,
                });
            }
        );
    }

    // [GET] -> path: /user/get/:username
    async get(req, res) {
        // * Get data from params and headers
        const { username } = req.params;
        const { currentuserid } = req.headers;

        try {
            // * Get user from db
            const user = await User.findOne({ username });

            if (!user) {
                return res
                    .status(401)
                    .json({ success: false, msg: 'Không tìm thấy người dùng' });
            }

            const isFollowed = user.follower.includes(currentuserid);
            const isFollowedReq = user.followerReq.includes(currentuserid);

            const data = {
                id: user._id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                photoURL: user.photoURL,
                bio: user.bio,
                gender: user.gender,
                private: user.private,
                followerCount: user.follower.length,
                followingCount: user.following.length,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                isFollowed,
                isFollowedReq,
            };

            // * Send data
            return res.status(200).json({
                success: true,
                data,
            });
        } catch (error) {
            return res
                .status(401)
                .json({ success: false, msg: 'Có lỗi gì đó...!' });
        }
    }

    // [PUT] -> path: /user/update
    async update(req, res) {
        // * Get data from client
        const { id, username, email, ...data } = req.body;
        const dataUpdate = {
            ...data,
        };

        // * Check username or email already exists when username or email send from client
        if (username) {
            const isUser = await User.findOne({ username });

            if (isUser) {
                return res.status(403).json({
                    success: false,
                    msg: 'Tên người dùng đã tồn tại',
                });
            }

            dataUpdate.username = username;
        }

        if (email) {
            const isEmail = await User.findOne({ email });
            if (isEmail) {
                return res.status(403).json({
                    success: false,
                    msg: 'Địa chỉ email đã tồn tại',
                });
            }

            dataUpdate.email = email;
        }

        // * Update data to mongodb
        try {
            const user = await User.findOneAndUpdate({ _id: id }, dataUpdate, {
                new: true,
            });

            const data = {
                id: user._id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                photoURL: user.photoURL,
                bio: user.bio,
                gender: user.gender,
                private: user.private,
                followerCount: user.follower.length,
                followingCount: user.following.length,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };

            return res.status(201).json({
                success: true,
                msg: 'Thông tin người dùng được cập nhật!',
                data,
            });
        } catch (error) {
            return res
                .status(401)
                .json({ success: false, msg: 'Có lỗi gì đó...!' });
        }
    }

    // [PUT] -> path: /user/follow
    async follow(req, res) {
        // * Get data from client
        const { followerId, followingId, isPrivate } = req.body;

        // * Update data to mongodb
        try {
            if (!isPrivate) {
                const follower = await User.findOneAndUpdate(
                    { _id: followerId },
                    {
                        $push: { follower: followingId },
                    },
                    {
                        new: true,
                    }
                );

                const following = await User.findOneAndUpdate(
                    { _id: followingId },
                    {
                        $push: { following: followerId },
                    },
                    {
                        new: true,
                    }
                );

                return res.status(201).json({
                    success: true,
                    msg: `Bạn đã theo dõi thành công ${follower.username}`,
                    data: {
                        followingCount: following.following.length,
                        followerCount: follower.follower.length,
                        isFollowed: true,
                    },
                });
            }

            await User.findOneAndUpdate(
                { _id: followingId },
                {
                    $push: { followingReq: followerId },
                }
            );

            const follower = await User.findOneAndUpdate(
                { _id: followerId },
                {
                    $push: { followerReq: followingId },
                }
            );

            return res.status(201).json({
                success: true,
                msg: `Bạn đã gửi yêu cầu theo dõi ${follower.username} thành công`,
                data: {
                    isFollowedReq: true,
                },
            });
        } catch (error) {
            return res
                .status(401)
                .json({ success: false, msg: 'Có lỗi gì đó...!' });
        }
    }

    // [PUT] -> path: /user/unfollow
    async unfollow(req, res) {
        // * Get data from client
        const { followerId, followingId, isFollowedReq } = req.body;

        try {
            if (isFollowedReq) {
                await User.findOneAndUpdate(
                    { _id: followingId },
                    {
                        $pull: { followingReq: followerId },
                    }
                );

                const follower = await User.findOneAndUpdate(
                    { _id: followerId },
                    {
                        $pull: { followerReq: followingId },
                    }
                );

                return res.status(201).json({
                    success: true,
                    msg: `Bạn đã hủy gửi yêu cầu theo dõi ${follower.username} thành công`,
                    data: {
                        isFollowedReq: false,
                    },
                });
            }

            const follower = await User.findOneAndUpdate(
                { _id: followerId },
                {
                    $pull: { follower: followingId },
                },
                {
                    new: true,
                }
            );

            const following = await User.findOneAndUpdate(
                { _id: followingId },
                {
                    $pull: { following: followerId },
                },
                {
                    new: true,
                }
            );

            return res.status(201).json({
                success: true,
                msg: `Bạn đã hủy theo dõi thành công ${follower.username}`,
                data: {
                    followingCount: following.following.length,
                    followerCount: follower.follower.length,
                    isFollowed: false,
                },
            });
        } catch (error) {
            return res
                .status(401)
                .json({ success: false, msg: 'Có lỗi gì đó...!' });
        }
    }
}

module.exports = new UserController();
