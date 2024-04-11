import express from 'express';
import { signupUser } from '../controllers/userController.js';

const router = express.Router();

// Sign up
router.post('/signup', signupUser);

// Login

export default router;
