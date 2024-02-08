import jwt from 'jsonwebtoken'

export const generateToken = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '24h'});

    // set jwt as http only
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });

    return token;
}