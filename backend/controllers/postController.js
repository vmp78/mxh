import User from '../models/userModel.js';
import Post from '../models/postModel.js';

const createPost = async (req, res) => {
    try {
        const { postedBy, text, img } = req.body;

        if (!text || !postedBy) return res.status(400).json({ message: 'Text and postedBy are missing' });

        const user = await User.findById(postedBy);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // req.user get from protectRoute
        if (user._id.toString() !== req.user._id.toString())
            return res.status(404).json({ message: 'Unauthorized to create post' });

        if (text.length > 500) return res.status(400).json({ message: 'Text must be less than 500 characters' });

        const newPost = new Post({
            text,
            img,
            postedBy,
        });

        await newPost.save();

        res.status(201).json({ message: 'Post created successfully', newPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('Error at createPost: ' + error.message);
    }
};

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json({ message: 'Post retrieved successfully', post });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('Error at getPost: ' + error.message);
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // req.user get from protectRoute
        if (post.postedBy.toString() !== req.user._id.toString())
            return res.status(404).json({ message: 'Unauthorized to delete this post' });

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Post deleted successfully', post });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('Error at deletePost: ' + error.message);
    }
};

const likePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        // req.user get from protectRoute
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const userLikedPost = post.likes.includes(userId);
        if (userLikedPost) {
            // Unlike post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });

            res.status(200).json({ message: 'Post unliked successfully', post });
        } else {
            // Like post
            await Post.updateOne({ _id: postId }, { $push: { likes: userId } });

            res.status(200).json({ message: 'Post liked successfully', post });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('Error at likePost: ' + error.message);
    }
};

const replyPost = async (req, res) => {
    try {
        const { text } = req.body;
        const { id: postId } = req.params;
        const userId = req.user._id;
        const userAvatar = req.user.avatar;
        const username = req.user.username;

        if (!text) return res.status(403).json({ message: 'Text is required' });

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const reply = { userId, username, userAvatar, text };

        post.replies.push(reply);
        await post.save();

        res.status(201).json({ message: 'Post replied successfully', post });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('Error at replyPost: ' + error.message);
    }
};

const getFeed = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        console.log(user._id.toString());
        console.log(userId.toString());
        if (user._id.toString() !== userId.toString()) return res.status(404).json({ message: 'Unauthorized' });

        const following = user.following;

        // Get the posts posted by the user's following and sort by newest time created
        const feedPost = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

        res.status(200).json({ message: 'Feed retrieved successfully', feedPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('Error at getFeed: ' + error.message);
    }
};

export { createPost, getPost, deletePost, likePost, replyPost, getFeed };
