const mongoose = require('mongoose');
const { getResourcesDB } = require('../config/dbSelector');
const resourceDB = getResourcesDB;

// Schema for Post model
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true,
    },
    creation_dt: {
        type: Date,
        default: Date.now,
    },
    last_updated: {
        type: Date,
        default: Date.now,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
});

const Post = resourceDB.model('Post', postSchema);
module.exports = Post;