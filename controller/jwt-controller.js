const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


import Token from '../model/token.js';

dotenv.config();

export const authenticateToken = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return response.status(401).json({ msg: 'Token is missing' });
    }

    try {
        const user = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
        request.user = user;
        next();
    } catch (error) {
        return response.status(403).json({ msg: 'Invalid token' });
    }
};

export const createNewToken = async (request, response) => {
    const refreshToken = request.body.token.split(' ')[1];

    if (!refreshToken) {
        return response.status(401).json({ msg: 'Refresh token is missing' });
    }

    const token = await Token.findOne({ token: refreshToken });

    if (!token) {
        return response.status(404).json({ msg: 'Refresh token is not valid' });
    }

    try {
        const user = jwt.verify(token.token, process.env.REFRESH_SECRET_KEY);
        const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' });

        return response.status(200).json({ accessToken });
    } catch (error) {
        return response.status(500).json({ msg: 'Invalid refresh token' });
    }
};
