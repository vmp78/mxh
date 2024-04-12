import express from 'express';
import { signupUser, loginUser, logoutUser, followUser } from '../controllers/userController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

// Sign up
router.post('/signup', signupUser);

// Login
router.post('/login', loginUser);

// Logout
router.post('/logout', logoutUser);

// Follow/unfollow
router.post('/follow/:id', protectRoute, followUser); // protectRoute use to prevent non login user from following/unfollowing

export default router;
