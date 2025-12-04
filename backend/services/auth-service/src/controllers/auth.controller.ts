import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // TODO: Check if user exists in DB
        // TODO: Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // TODO: Create user in DB

        // Mock response
        res.status(201).json({
            message: 'User registered successfully',
            user: { email, firstName, lastName }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // TODO: Validate user from DB
        // Mock validation
        if (email === 'demo@healthtwin.com' && password === 'password') {
            const token = jwt.sign({ userId: 'user_123', email }, JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({
                token,
                user: { id: 'user_123', email, firstName: 'Demo', lastName: 'User' }
            });
        }

        res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const validateToken = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ valid: false, message: 'Token required' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).json({ valid: true, decoded });
    } catch (error) {
        res.status(401).json({ valid: false, message: 'Invalid token' });
    }
};
