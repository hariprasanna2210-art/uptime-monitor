import express from 'express';
import { getWebsites, getWebsiteById, addWebsite, deleteWebsite, updateWebsite } from '../controllers/website.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(protect, getWebsites)
    .post(protect, addWebsite);

router.route('/:id')
    .get(protect, getWebsiteById)
    .delete(protect, deleteWebsite)
    .put(protect, updateWebsite);

export default router;
