import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller';
import { protect, admin } from '../middleware/auth.middleware';
import { Request, Response } from 'express';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, (req: Request | any, res: Response) => {
    res.json(req.user);
});

export default router;
