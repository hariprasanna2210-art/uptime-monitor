import prisma from '../config/db';
import { logger } from '../utils/logger';
import nodemailer from 'nodemailer';
import admin from 'firebase-admin';

// Initialize Firebase Admin (Mock or Real)
// In a real scenario, we need the service account json
try {
    if (process.env.FIREBASE_CREDENTIALS_PATH) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const serviceAccount = require(process.env.FIREBASE_CREDENTIALS_PATH);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        logger.info('Firebase Admin Initialized');
    }
} catch (error) {
    logger.warn('Firebase credentials not found or invalid. Push notifications will be mocked.');
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'test',
        pass: process.env.SMTP_PASS || 'test',
    },
});

export const sendNotification = async (website: any, status: 'UP' | 'DOWN') => {
    try {
        const user = await prisma.user.findUnique({ where: { id: website.user_id } });
        if (!user) return;

        const message = `Alert: ${website.name} (${website.url}) is now ${status}.`;
        const title = `Website ${status}: ${website.name}`;

        // 1. Send Email
        await sendEmail(user.email, title, message);
        await logNotification(user.id, website.id, 'EMAIL', message);

        // 2. Send Push (if FCM token exists)
        if (user.fcm_token) {
            await sendPush(user.fcm_token, title, message);
            await logNotification(user.id, website.id, 'PUSH', message);
        }

    } catch (error) {
        logger.error('Error in sendNotificationService', error);
    }
};

const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        await transporter.sendMail({
            from: '"Uptime Monitor" <no-reply@uptimemonitor.com>',
            to,
            subject,
            text,
        });
        logger.info(`Email sent to ${to}`);
    } catch (error) {
        logger.error(`Failed to send email to ${to}`, error);
    }
};

const sendPush = async (token: string, title: string, body: string) => {
    try {
        if (admin.apps.length > 0) {
            await admin.messaging().send({
                token,
                notification: {
                    title,
                    body,
                },
            });
            logger.info(`Push sent to ${token}`);
        } else {
            logger.info(`[MOCK] Push sent to ${token}: ${title} - ${body}`);
        }
    } catch (error) {
        logger.error(`Failed to send push to ${token}`, error);
    }
};

const logNotification = async (userId: string, websiteId: string, type: 'EMAIL' | 'PUSH', message: string) => {
    try {
        await prisma.notification.create({
            data: {
                user_id: userId,
                website_id: websiteId,
                type,
                message,
            },
        });
    } catch (error) {
        logger.error('Error logging notification', error);
    }
};
