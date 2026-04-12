import { Router } from 'express';
import { listProjects, createProject, deleteProject } from '../controllers/projectController';

const router = Router();
router.get('/', listProjects);
router.post('/', createProject);
router.delete('/:id', deleteProject);

export default router;
