import express from 'express';
import {
    signupUser,
    loginUser,
    logoutUser,
    followUser,
    updateUser,
    getUserProfile,
    getSuggestedUsers,
    freezeAccount,
    searchUser,
} from '../controllers/userController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

// Search user
router.get('/search/:query', searchUser);

// Get profile
router.get('/profile/:query', getUserProfile);

router.get('/suggested', protectRoute, getSuggestedUsers);

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

router.put('/freeze', protectRoute, freezeAccount);

export default router;
