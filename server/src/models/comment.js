// Import library
const mongoose = require('mongoose');

// Create schema
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        description: { type: String, require: true },
        postId: { type: mongoose.Schema.Types.ObjectId, ref: 'post' },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('comment', CommentSchema);
