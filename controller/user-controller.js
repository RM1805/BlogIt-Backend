import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Token from '../model/token.js';
import User from '../model/user.js';

dotenv.config();

export const signupUser = async (request, response) => {
    try {
        const hashedPassword = await bcrypt.hash(request.body.password, 10);

        const user = {
            username: request.body.username,
            name: request.body.name,
            password: hashedPassword,
        };

        const newUser = new User(user);
        await newUser.save();

        return response.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        return response.status(500).json({ message: 'Error while signing up user', error: error.message });
    }
};

export const loginUser = async (request, response) => {
    try {
        const user = await User.findOne({ username: request.body.username });

        if (!user) {
            return response.status(400).json({ message: 'Username not found' });
        }

        const match = await bcrypt.compare(request.body.password, user.password);

        if (!match) {
            return response.status(401).json({ message: 'Password does not match' });
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET_KEY);

        const newToken = new Token({ token: refreshToken });
        await newToken.save();

        response.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            name: user.name,
            username: user.username,
        });
    } catch (error) {
        response.status(500).json({ message: 'Error while logging in the user', error: error.message });
    }
};

export const logoutUser = async (request, response) => {
    const token = request.body.token;

    try {
        await Token.deleteOne({ token: token });

        response.status(204).json({ message: 'Logout successful' });
    } catch (error) {
        response.status(500).json({ message: 'Error while logging out', error: error.message });
    }
};
