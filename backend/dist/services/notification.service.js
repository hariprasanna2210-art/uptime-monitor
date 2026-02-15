"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const db_1 = __importDefault(require("../config/db"));
const logger_1 = require("../utils/logger");
const nodemailer_1 = __importDefault(require("nodemailer"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
// Initialize Firebase Admin (Mock or Real)
// In a real scenario, we need the service account json
try {
    if (process.env.FIREBASE_CREDENTIALS_PATH) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const serviceAccount = require(process.env.FIREBASE_CREDENTIALS_PATH);
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(serviceAccount)
        });
        logger_1.logger.info('Firebase Admin Initialized');
    }
}
catch (error) {
    logger_1.logger.warn('Firebase credentials not found or invalid. Push notifications will be mocked.');
}
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'test',
        pass: process.env.SMTP_PASS || 'test',
    },
});
const sendNotification = async (website, status) => {
    try {
        const user = await db_1.default.user.findUnique({ where: { id: website.user_id } });
        if (!user)
            return;
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
    }
    catch (error) {
        logger_1.logger.error('Error in sendNotificationService', error);
    }
};
exports.sendNotification = sendNotification;
const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: '"Uptime Monitor" <no-reply@uptimemonitor.com>',
            to,
            subject,
            text,
        });
        logger_1.logger.info(`Email sent to ${to}`);
    }
    catch (error) {
        logger_1.logger.error(`Failed to send email to ${to}`, error);
    }
};
const sendPush = async (token, title, body) => {
    try {
        if (firebase_admin_1.default.apps.length > 0) {
            await firebase_admin_1.default.messaging().send({
                token,
                notification: {
                    title,
                    body,
                },
            });
            logger_1.logger.info(`Push sent to ${token}`);
        }
        else {
            logger_1.logger.info(`[MOCK] Push sent to ${token}: ${title} - ${body}`);
        }
    }
    catch (error) {
        logger_1.logger.error(`Failed to send push to ${token}`, error);
    }
};
const logNotification = async (userId, websiteId, type, message) => {
    try {
        await db_1.default.notification.create({
            data: {
                user_id: userId,
                website_id: websiteId,
                type,
                message,
            },
        });
    }
    catch (error) {
        logger_1.logger.error('Error logging notification', error);
    }
};
