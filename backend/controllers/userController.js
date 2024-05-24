import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import genTokenAndSetCookie from '../utils/helpers/genTokenAndSetCookie.js';
import {v2 as cloudinary} from "cloudinary";

const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).select('-password').select('-updatedAt'); // select anything but the password and updatedAt fields
        if (!user) return res.status(400).json({ error: 'User not found!' });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log('Error in getUserProfile: ' + error.message);
    }
};

const signupUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] }); // find the user by email or username

        // console.log(name, email, username);
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // const newUser = new User({ name, email, username, password: hashedPassword });
        const newUser = new User({ name, email, username, password: hashedPassword });
        await newUser.save();

        if (newUser) {
            genTokenAndSetCookie(newUser._id, res);

            res.status(201).json({
                message: 'User signup successfully',
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                avatar: newUser.avatar,
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({  error: error.message });
        console.log('Error in signupUser: ' + error.message);
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Username not exist' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({  error: 'Invalid password' });

        genTokenAndSetCookie(user._id, res);

        res.status(200).json({
            message: 'Successfully logged in',
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            avatar: user.avatar,
        });
    } catch (error) {
        res.status(500).json({  error: error.message });
        console.log('Error in loginUser: ' + error.message);
    }
};

const logoutUser = (req, res) => {
    try {
        res.cookie('token', '', { maxAge: 1 }); // clear the cookie
        res.status(200).json({
            message: 'Successfully logged out',
        });
    } catch (error) {
        res.status(500).json({  error: error.message });
        console.log('Error in logoutUser: ' + error.message);
    }
};

const followUser = async (req, res) => {
    try {
        const { id } = req.params; // id of the destUser
        const destUser = await User.findById(id);
        const currUser = await User.findById(req.user._id); // get user from protectRoute

        if (id === req.user._id.toString())
            return res.status(400).json({  error: 'Cannot follow/unfollow yourself!' });

        if (!destUser || !currUser) return res.status(404).json({  error: 'User not found!' });

        const isFollowing = currUser.following.includes(id);
        if (isFollowing) {
            // Unfollow user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } }); // delete from follower of destUser
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } }); // delete from following of currUser

            res.status(200).json({ message: 'Unfollow user!' });
        } else {
            // Follow user
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } }); // add to follower of destUser
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } }); // add to following of currUser

            res.status(200).json({ message: 'Follow user!' });
        }
    } catch (error) {
        res.status(500).json({  error: error.message });
        console.log('Error in followUser: ' + error.message);
    }
};

const updateUser = async (req, res) => {
    const { name, email, username, password, bio } = req.body;
    let {avatar} = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({  error: 'User not found!' });

        if (req.params.id !== userId.toString())
            return res.status(404).json({  error: "Cannot update other user's profile!" });

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        if(avatar){
            if(user.avatar){
                await cloudinary.uploader.destroy(user.avatar.split("/").pop().split(".")[0]);
            }

            const uploadResponse = await cloudinary.uploader.upload(avatar);
            avatar= uploadResponse.secure_url;
        }   

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.avatar = avatar || user.avatar;
        user.bio = bio || user.bio;

        user = await user.save();

        res.status(200).json({ message: 'Update successful', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log('Error in updateUser: ' + error.message);
    }
};

export { signupUser, loginUser, logoutUser, followUser, updateUser, getUserProfile };
