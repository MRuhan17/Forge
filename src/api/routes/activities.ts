import { Router } from 'express';
import { listActivities, createActivity } from '../controllers/activityController';

const router = Router();
router.get('/', listActivities);
router.post('/', createActivity);

export default router;
