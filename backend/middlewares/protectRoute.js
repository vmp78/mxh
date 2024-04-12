import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// check if the user is authenticated
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: 'Not logged in!' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // check the token to get the payload

        const user = await User.findById(decoded.userId).select('-password'); // select anything but the password

        req.user = user;

        next(); // call next function
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log('Error in protectRoute: ' + error.message);
    }
};

export default protectRoute;
