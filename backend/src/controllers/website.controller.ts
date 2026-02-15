import { Request, Response } from 'express';
import prisma from '../config/db';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Get all websites
// @route   GET /api/websites
// @access  Private
export const getWebsites = async (req: AuthRequest, res: Response) => {
    try {
        const websites = await prisma.website.findMany({
            where: { user_id: req.user.id },
            include: {
                logs: {
                    take: 1,
                    orderBy: { checked_at: 'desc' },
                },
            },
        });
        res.json(websites);
    } catch (error) {
        logger.error('Error in getWebsites', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get website by ID
// @route   GET /api/websites/:id
// @access  Private
export const getWebsiteById = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        const website = await prisma.website.findFirst({
            where: { id, user_id: req.user.id },
            include: {
                logs: {
                    take: 20,
                    orderBy: { checked_at: 'desc' },
                },
            },
        });

        if (website) {
            res.json(website);
        } else {
            res.status(404).json({ message: 'Website not found' });
        }
    } catch (error) {
        logger.error('Error in getWebsiteById', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a website
// @route   POST /api/websites
// @access  Private
export const addWebsite = async (req: AuthRequest, res: Response) => {
    const { name, url, check_interval } = req.body;

    try {
        const website = await prisma.website.create({
            data: {
                user_id: req.user.id,
                name,
                url,
                check_interval: check_interval || 5,
            },
        });
        res.status(201).json(website);
    } catch (error) {
        logger.error('Error in addWebsite', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a website
// @route   DELETE /api/websites/:id
// @access  Private
export const deleteWebsite = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        const website = await prisma.website.findFirst({
            where: { id, user_id: req.user.id },
        });

        if (website) {
            await prisma.website.delete({ where: { id } });
            res.json({ message: 'Website removed' });
        } else {
            res.status(404).json({ message: 'Website not found' });
        }
    } catch (error) {
        logger.error('Error in deleteWebsite', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a website
// @route   PUT /api/websites/:id
// @access  Private
export const updateWebsite = async (req: AuthRequest, res: Response) => {
    const { name, url, check_interval } = req.body;

    try {
        const id = req.params.id as string;
        const website = await prisma.website.findFirst({
            where: { id, user_id: req.user.id },
        });

        if (website) {
            const updatedWebsite = await prisma.website.update({
                where: { id },
                data: {
                    name: name || website.name,
                    url: url || website.url,
                    check_interval: check_interval || website.check_interval,
                }
            });
            res.json(updatedWebsite);
        } else {
            res.status(404).json({ message: 'Website not found' });
        }
    } catch (error) {
        logger.error('Error in updateWebsite', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
