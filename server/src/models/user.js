// Import library
const mongoose = require('mongoose');

// Create schema
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        email: { type: String, require: true, unique: true },
        fullname: { type: String, require: true },
        username: { type: String, require: true, unique: true },
        password: { type: String, require: true },
        photoURL: { type: String, default: '' },
        bio: { type: String, default: '' },
        gender: { type: Number, default: 0 },
        private: { type: Boolean, default: false },
        follower: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                default: [],
                unique: true,
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                default: [],
                unique: true,
            },
        ],
        followerReq: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                default: [],
                unique: true,
            },
        ],
        followingReq: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                default: [],
                unique: true,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('user', UserSchema);
