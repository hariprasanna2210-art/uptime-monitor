import { Request, Response } from 'express';
import prisma from '../config/db';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                created_at: true,
                _count: {
                    select: { websites: true }
                }
            },
        });
        res.json(users);
    } catch (error) {
        logger.error('Error in getUsers', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        const user = await prisma.user.findUnique({ where: { id } });

        if (user) {
            await prisma.user.delete({ where: { id } });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        logger.error('Error in deleteUser', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
