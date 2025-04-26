const express = require('express');
const router = express.Router();
const verifyAccess = require('../middleware/verification_black_box');
const Post = require('../models/post');

// Create post
router.post('/create', verifyAccess('create:post'), async (req, res) => {
    try {
        const { title, content, enabled } = req.body;
        const user = req.user;
        const newPost = new Post({ title, content, author: user._id, enabled });
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
});

// Get post by ID
router.get('/:id', verifyAccess('read:post'), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post', error });
    }
});

// Update post
router.put('/:id', verifyAccess('update:post'), async (req, res) => {
    try {
        const { title, content, enabled } = req.body;
        const user = req.user;
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, { title, content, author: user._id, enabled, last_updated: new Date() }, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
});

// Delete post
router.delete('/:id', verifyAccess('delete:post'), async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
});

// Get all posts
router.get('/', verifyAccess('read:post'), async (req, res) => {
    try {
        const posts = await Post.find().populate('author');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
});

module.exports = router;