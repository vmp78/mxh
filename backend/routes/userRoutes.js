import express from 'express';
import {
    signupUser,
    loginUser,
    logoutUser,
    followUser,
    updateUser,
    getUserProfile,
} from '../controllers/userController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

// Get profile
router.get('/profile/:username', getUserProfile);

// Sign up
router.post('/signup', signupUser);

// Login
router.post('/login', loginUser);

// Logout
router.post('/logout', logoutUser);

// Follow/unfollow
router.post('/follow/:id', protectRoute, followUser); // protectRoute use to prevent non login user from following/unfollowing

// Update user
router.put('/update/:id', protectRoute, updateUser);

export default router;
