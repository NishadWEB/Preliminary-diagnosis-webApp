import express from 'express';
import { getTermsPage } from '../controllers/termsController.js';

const router = express.Router();

router.get('/terms',getTermsPage);

export default router;