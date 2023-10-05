import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Token from '../model/token.js';

dotenv.config();

export const authenticateToken = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return response.status(401).json({ message: 'Token is missing' });
    }

    try {
        const user = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
        request.user = user;
        next();
    } catch (error) {
        return response.status(403).json({ message: 'Invalid token' });
    }
};

export const createNewToken = async (request, response) => {
    const refreshToken = request.body.token;

    if (!refreshToken) {
        return response.status(401).json({ message: 'Refresh token is missing' });
    }

    try {
        const tokenDocument = await Token.findOne({ token: refreshToken });

        if (!tokenDocument) {
            return response.status(404).json({ message: 'Refresh token is not valid' });
        }

        const user = jwt.verify(tokenDocument.token, process.env.REFRESH_SECRET_KEY);
        const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' });

        return response.status(200).json({ accessToken });
    } catch (error) {
        return response.status(500).json({ message: 'Invalid refresh token' });
    }
};
