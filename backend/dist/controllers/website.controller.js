"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWebsite = exports.deleteWebsite = exports.addWebsite = exports.getWebsiteById = exports.getWebsites = void 0;
const db_1 = __importDefault(require("../config/db"));
const logger_1 = require("../utils/logger");
// @desc    Get all websites
// @route   GET /api/websites
// @access  Private
const getWebsites = async (req, res) => {
    try {
        const websites = await db_1.default.website.findMany({
            where: { user_id: req.user.id },
            include: {
                logs: {
                    take: 1,
                    orderBy: { checked_at: 'desc' },
                },
            },
        });
        res.json(websites);
    }
    catch (error) {
        logger_1.logger.error('Error in getWebsites', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getWebsites = getWebsites;
// @desc    Get website by ID
// @route   GET /api/websites/:id
// @access  Private
const getWebsiteById = async (req, res) => {
    try {
        const website = await db_1.default.website.findFirst({
            where: { id: req.params.id, user_id: req.user.id },
            include: {
                logs: {
                    take: 20,
                    orderBy: { checked_at: 'desc' },
                },
            },
        });
        if (website) {
            res.json(website);
        }
        else {
            res.status(404).json({ message: 'Website not found' });
        }
    }
    catch (error) {
        logger_1.logger.error('Error in getWebsiteById', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getWebsiteById = getWebsiteById;
// @desc    Add a website
// @route   POST /api/websites
// @access  Private
const addWebsite = async (req, res) => {
    const { name, url, check_interval } = req.body;
    try {
        const website = await db_1.default.website.create({
            data: {
                user_id: req.user.id,
                name,
                url,
                check_interval: check_interval || 5,
            },
        });
        res.status(201).json(website);
    }
    catch (error) {
        logger_1.logger.error('Error in addWebsite', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.addWebsite = addWebsite;
// @desc    Delete a website
// @route   DELETE /api/websites/:id
// @access  Private
const deleteWebsite = async (req, res) => {
    try {
        const website = await db_1.default.website.findFirst({
            where: { id: req.params.id, user_id: req.user.id },
        });
        if (website) {
            await db_1.default.website.delete({ where: { id: req.params.id } });
            res.json({ message: 'Website removed' });
        }
        else {
            res.status(404).json({ message: 'Website not found' });
        }
    }
    catch (error) {
        logger_1.logger.error('Error in deleteWebsite', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.deleteWebsite = deleteWebsite;
// @desc    Update a website
// @route   PUT /api/websites/:id
// @access  Private
const updateWebsite = async (req, res) => {
    const { name, url, check_interval } = req.body;
    try {
        const website = await db_1.default.website.findFirst({
            where: { id: req.params.id, user_id: req.user.id },
        });
        if (website) {
            const updatedWebsite = await db_1.default.website.update({
                where: { id: req.params.id },
                data: {
                    name: name || website.name,
                    url: url || website.url,
                    check_interval: check_interval || website.check_interval,
                }
            });
            res.json(updatedWebsite);
        }
        else {
            res.status(404).json({ message: 'Website not found' });
        }
    }
    catch (error) {
        logger_1.logger.error('Error in updateWebsite', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.updateWebsite = updateWebsite;
