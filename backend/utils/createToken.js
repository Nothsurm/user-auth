import jwt from 'jsonwebtoken'

export const generateToken = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '24h'});

    // set jwt as http only
    res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        expires: new Date(Date.now() + 86400)
    });

    return token;
}