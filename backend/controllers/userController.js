import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import genTokenAndSetCookie from '../utils/helpers/genTokenAndSetCookie.js';

const signupUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] }); // find the user by email or username

        // console.log(name, email, username);
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
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
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid password' });

        genTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('Error in loginUser: ' + error.message);
    }
};

const logoutUser = (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 1 }); // clear the cookie
        res.status(200).json({
            message: 'Successfully logged out',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('Error in logoutUser: ' + error.message);
    }
};

const followUser = async (req, res) => {
    try {
        const { id } = req.params; // id of the destUser
        const destUser = await User.findById(id);
        const currUser = await User.findById(req.user._id); // get user from protectRoute

        if (id === req.user._id) return res.status(400).json({ message: 'Cannot follow/unfollow yourself!' });

        if (!destUser || !currUser) return res.status(404).json({ message: 'User not found!' });

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
        res.status(500).json({ message: error.message });
        console.log('Error in followUser: ' + error.message);
    }
};
export { signupUser, loginUser, logoutUser, followUser };
