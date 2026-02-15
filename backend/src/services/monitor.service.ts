import cron from 'node-cron';
import axios from 'axios';
import prisma from '../config/db';
import { logger } from '../utils/logger';
import { sendNotification } from './notification.service';

export const startMonitoring = () => {
    logger.info('Starting monitoring service...');

    // Run every 1 minute for testing, or 5 minutes as requested
    // */5 * * * * for 5 minutes.
    cron.schedule('*/5 * * * *', async () => {
        logger.info('Running scheduled checks...');
        await checkAllWebsites();
    });
};

const checkAllWebsites = async () => {
    try {
        const websites = await prisma.website.findMany();

        for (const website of websites) {
            checkWebsite(website);
        }
    } catch (error) {
        logger.error('Error fetching websites for monitoring', error);
    }
};

const checkWebsite = async (website: any) => {
    const start = Date.now();
    let status: 'UP' | 'DOWN' = 'DOWN';
    let statusCode = 0;
    let responseTime = 0;

    try {
        const response = await axios.get(website.url, { timeout: 10000 });
        status = 'UP';
        statusCode = response.status;
    } catch (error: any) {
        status = 'DOWN';
        if (error.response) {
            statusCode = error.response.status;
        } else {
            statusCode = 0; // Network error / timeout
        }
    } finally {
        responseTime = Date.now() - start;
    }

    // Log status
    try {
        await prisma.statusLog.create({
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
            logger.info(`Status change detected for ${website.url}: ${website.last_status} -> ${status}`);

            // Update website
            await prisma.website.update({
                where: { id: website.id },
                data: {
                    last_status: status,
                    last_checked_at: new Date(),
                },
            });

            // Send notification
            await sendNotification(website, status);
        } else {
            // Just update last_checked
            await prisma.website.update({
                where: { id: website.id },
                data: {
                    last_checked_at: new Date(),
                },
            });
        }

    } catch (error) {
        logger.error(`Error saving log for ${website.url}`, error);
    }
};
