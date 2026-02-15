"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUsers = void 0;
const db_1 = __importDefault(require("../config/db"));
const logger_1 = require("../utils/logger");
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await db_1.default.user.findMany({
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
    }
    catch (error) {
        logger_1.logger.error('Error in getUsers', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getUsers = getUsers;
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await db_1.default.user.findUnique({ where: { id: req.params.id } });
        if (user) {
            await db_1.default.user.delete({ where: { id: req.params.id } });
            res.json({ message: 'User removed' });
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        logger_1.logger.error('Error in deleteUser', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.deleteUser = deleteUser;
