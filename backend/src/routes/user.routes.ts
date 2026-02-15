import express from 'express';
import { getUsers, deleteUser } from '../controllers/user.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);
router.use(admin);

router.route('/')
    .get(getUsers);

router.route('/:id')
    .delete(deleteUser);

export default router;
