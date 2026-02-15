"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startMonitoring = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const axios_1 = __importDefault(require("axios"));
const db_1 = __importDefault(require("../config/db"));
const logger_1 = require("../utils/logger");
const notification_service_1 = require("./notification.service");
const startMonitoring = () => {
    logger_1.logger.info('Starting monitoring service...');
    // Run every 1 minute for testing, or 5 minutes as requested
    // */5 * * * * for 5 minutes.
    node_cron_1.default.schedule('*/5 * * * *', async () => {
        logger_1.logger.info('Running scheduled checks...');
        await checkAllWebsites();
    });
};
exports.startMonitoring = startMonitoring;
const checkAllWebsites = async () => {
    try {
        const websites = await db_1.default.website.findMany();
        for (const website of websites) {
            checkWebsite(website);
        }
    }
    catch (error) {
        logger_1.logger.error('Error fetching websites for monitoring', error);
    }
};
const checkWebsite = async (website) => {
    const start = Date.now();
    let status = 'DOWN';
    let statusCode = 0;
    let responseTime = 0;
    try {
        const response = await axios_1.default.get(website.url, { timeout: 10000 });
        status = 'UP';
        statusCode = response.status;
    }
    catch (error) {
        status = 'DOWN';
        if (error.response) {
            statusCode = error.response.status;
        }
        else {
            statusCode = 0; // Network error / timeout
        }
    }
    finally {
        responseTime = Date.now() - start;
    }
    // Log status
    try {
        await db_1.default.statusLog.create({
            data: {
                website_id: website.id,
                status,
                status_code: statusCode,
                response_time: responseTime,
            },
        });
        // Update website status
        // Check if status changed
        if (website.last_status !== status) {
            logger_1.logger.info(`Status change detected for ${website.url}: ${website.last_status} -> ${status}`);
            // Update website
            await db_1.default.website.update({
                where: { id: website.id },
                data: {
                    last_status: status,
                    last_checked_at: new Date(),
                },
            });
            // Send notification
            await (0, notification_service_1.sendNotification)(website, status);
        }
        else {
            // Just update last_checked
            await db_1.default.website.update({
                where: { id: website.id },
                data: {
                    last_checked_at: new Date(),
                },
            });
        }
    }
    catch (error) {
        logger_1.logger.error(`Error saving log for ${website.url}`, error);
    }
};
