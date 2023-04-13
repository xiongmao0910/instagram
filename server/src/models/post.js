// Import library
const mongoose = require('mongoose');

// Create schema
const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        media: [{ type: String, require: true }],
        caption: { type: String, max: 500, default: '' },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('post', PostSchema);
