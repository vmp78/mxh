import express from 'express';
import {
    createPost,
    getPost,
    deletePost,
    likePost,
    replyPost,
    getFeed,
    getUserPosts,
    repost,
    getUserReposts,
} from '../controllers/postController.js';
import protectRoute from '../middlewares/protectRoute.js';
 
const router = express.Router();
 
// Get newsfeed
router.get('/feed', protectRoute, getFeed);
 
// Get post
router.get('/:id', getPost);
 
// Get repost
router.get('/user/repost/:username', getUserReposts);
 
router.get('/user/:username', getUserPosts);
 
// Create post
router.post('/create', protectRoute, createPost);
 
// Repost
router.post('/repost', protectRoute, repost);
 
// Delete post
router.delete('/:id', protectRoute, deletePost);
 
// Like/unlike post
router.put('/like/:id', protectRoute, likePost);
 
// Reply post
router.put('/reply/:id', protectRoute, replyPost);
 
export default router;