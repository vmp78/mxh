import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import {v2 as cloudinary} from 'cloudinary';


const createPost = async (req, res) => {
    try {
        const { postedBy, text} = req.body;
        let {img}=req.body;

        if (!text || !postedBy) return res.status(400).json({ error: 'Text and postedBy are missing' });

        const user = await User.findById(postedBy);
        if (!user) return res.status(404).json({ error : 'User not found' });

        // req.user get from protectRoute
        if (user._id.toString() !== req.user._id.toString())
            return res.status(404).json({ error: 'Unauthorized to create post' });

        if (text.length > 500) return res.status(400).json({ error: 'Text must be less than 500 characters' });
        if(img){
            const uploaderResponse= await cloudinary.uploader.upload(img);
            img=uploaderResponse.secure_url;
        }
        const newPost = new Post({
            text,
            img,
            postedBy,
        });

        await newPost.save();

        res.status(201).json({ message: 'Post created successfully', newPost });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log('Error at createPost: ' + error.message);
    }
};

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        res.status(200).json( post );
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log('Error at getPost: ' + error.message);
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        // req.user get from protectRoute
        if (post.postedBy.toString() !== req.user._id.toString())
            return res.status(404).json({ error: 'Unauthorized to delete this post' });

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Post deleted successfully', post });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log('Error at deletePost: ' + error.message);
    }
};

const likePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        // req.user get from protectRoute
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

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
        res.status(500).json({ error: error.message });
        console.log('Error at likePost: ' + error.message);
    }
};

const replyPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId  = req.params._id;
        const userId = req.user._id;
        const userAvatar = req.user.avatar;
        const username = req.user.username;

        if (!text) return res.status(403).json({ error: 'Text is required' });

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const reply = { userId, username, userAvatar, text };

        post.replies.push(reply);
        await post.save();

        res.status(201).json({ message: 'Post replied successfully', post });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log('Error at replyPost: ' + error.message);
    }
};

const getFeed = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        console.log(user._id.toString());
        console.log(userId.toString());
        if (user._id.toString() !== userId.toString()) return res.status(404).json({ message: 'Unauthorized' });

        const following = user.following;

        // Get the posts posted by the user's following and sort by newest time created
        const feedPost = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

        res.status(200).json( feedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log('Error at getFeed: ' + error.message);
    }
};

const getUserPosts = async (req, res)=>{
    const {username}= req.params;
    try {
        const user = await User.findOne({ username });
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }

        const posts = await Post.find({ postedBy: user._id}).sort({createAt:-1});

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { createPost, getPost, deletePost, likePost, replyPost, getFeed, getUserPosts };
