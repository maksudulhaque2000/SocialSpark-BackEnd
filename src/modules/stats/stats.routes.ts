import express from 'express';
import { getStats } from './stats.controller';

const router = express.Router();

// Public route - anyone can see platform statistics
router.get('/', getStats);

export default router;
