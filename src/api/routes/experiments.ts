import { Router } from 'express';
import { listExperiments, createExperiment, deleteExperiment } from '../controllers/experimentController';

const router = Router();
router.get('/', listExperiments);
router.post('/', createExperiment);
router.delete('/:id', deleteExperiment);

export default router;
