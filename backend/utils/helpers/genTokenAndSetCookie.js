import jwt from 'jsonwebtoken';

const genTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
        expiresIn: '15d',
    });

    res.cookie('token', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true, // can not be accessed by js
        sameSite: 'strict', // for security
    });

    return token;
};

export default genTokenAndSetCookie;
