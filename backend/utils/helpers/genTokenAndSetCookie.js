import jwt from 'jsonwebtoken';

const genTokenAndSetCookie = (userId, res) => {
    // generate a jwt token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d',
    });

    res.cookie('token', token, {
        httpOnly: true, // can not be accessed by js
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: 'strict', // for security
    });

    return token;
};

export default genTokenAndSetCookie;
