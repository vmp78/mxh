import Post from '../models/postModel.js';
import Repost from '../models/repostModel.js';
import User from '../models/userModel.js';
import { v2 as cloudinary } from 'cloudinary';

const createPost = async (req, res) => {
    try {
        const { postedBy, text } = req.body;
        let { img } = req.body;

        if (!postedBy || !text) {
            return res.status(400).json({ error: 'Text field is required' });
        }

        const user = await User.findById(postedBy);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'Unauthorized to create post.' });
        }

        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ error: `Text must be less than ${maxLength} characters.` });
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({ postedBy, text, img });
        await newPost.save();

        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'Unauthorized to delete post' });
        }

        if (post.img) {
            const imgId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        await Repost.deleteMany({ post: req.params.id });

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updatePost = async (req, res) => {
    const { text, postId } = req.body;
    let { img } = req.body;

    try {
        let post = await Post.findById(postId);
        if (!post) return res.status(400).json({ error: 'Post not found!' });

        if (req.params.id !== post.postedBy.toString())
            return res.status(400).json({ error: "You cannot update other user's post!" });

        if (img) {
            if (post.img) {
                await cloudinary.uploader.destroy(post.img.split('/').pop().split('.')[0]);
            }

            if (!img.includes('res.cloudinary.com')) {
                const uploadedResponse = await cloudinary.uploader.upload(img);
                img = uploadedResponse.secure_url;
            }
        }

        post.text = text;
        post.img = img || post.img;

        post = await post.save();

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log('Error in updatePost: ', err.message);
    }
};

const repost = async (req, res) => {
    try {
        const { post, postedBy } = req.body;

        const user = await User.findById(postedBy);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'Unauthorized to repost' });
        }

        const repost = await Repost.findOne({ post: post._id, postedBy: postedBy });
        if (repost) {
            const postIndex = post.reposts.findIndex((id) => id.toString() === user._id.toString());
            if (postIndex !== -1) {
                post.reposts.splice(postIndex, 1);
            }
            await Post.findByIdAndUpdate(post._id, { $set: { reposts: post.reposts } });
            await Repost.deleteOne({ _id: repost._id });
            return res
                .status(201)
                .json({ message: 'You have already reposted this post. Your last repost will be deleted!' });
        }

        post.reposts.push(user._id);
        await Post.findByIdAndUpdate(post._id, { $set: { reposts: post.reposts } });

        const newRepost = new Repost({ postedBy, post });
        await newRepost.save();

        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};

const likePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            // Unlike post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            res.status(200).json({ message: 'Post unliked successfully' });
        } else {
            // Like post
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: 'Post liked successfully' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const replyPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userAvatar = req.user.avatar;
        const username = req.user.username;

        if (!text) {
            return res.status(400).json({ error: 'Text field is required' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const reply = { userId, text, userAvatar, username };

        post.replies.push(reply);
        await post.save();

        res.status(200).json(reply);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getFeed = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const following = user.following;

        const filteredUsers = (
            await Promise.all(
                following.map(async (followedUserId) => {
                    const currentUser = await User.findById(followedUserId);
                    if (currentUser) {
                        if (!currentUser.isFrozen) {
                            return followedUserId;
                        }
                    } 
                    return null;
                })
            )
        ).filter(Boolean);

        const feedPosts = await Post.find({ postedBy: { $in: filteredUsers } }).sort({ createdAt: -1 });
        const feedReposts = await Repost.find({ postedBy: { $in: filteredUsers } })
            .sort({ createdAt: -1 })
            .populate('post');
        
        res.status(200).json({ feedPosts, feedReposts });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log('Error at getFeed: ' + err.message);
    }
};


const getPost = async (req, res) => {
    try {
        const post = await Post.find({
            _id: req.params.id,
        });

        if (post.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getUserReposts = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const reposts = await Repost.find({ postedBy: user._id }).sort({ createdAt: -1 }).populate('post');

        res.status(200).json(reposts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserPosts = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const posts = await Post.find({ postedBy: user._id, isRepost: { $exists: false } }).sort({
            createdAt: -1,
        });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    createPost,
    getPost,
    deletePost,
    likePost,
    replyPost,
    getFeed,
    getUserPosts,
    repost,
    getUserReposts,
    updatePost,
};
