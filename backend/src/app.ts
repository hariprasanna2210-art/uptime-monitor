import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({ message: 'Uptime Monitor API is running' });
});

import authRoutes from './routes/auth.routes';
import websiteRoutes from './routes/website.routes';
import { errorHandler } from './middleware/error';

app.use('/api/auth', authRoutes);
app.use('/api/websites', websiteRoutes);

import userRoutes from './routes/user.routes';
app.use('/api/users', userRoutes);

import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(errorHandler);

import { startMonitor } from './services/monitor.service';
startMonitor();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
