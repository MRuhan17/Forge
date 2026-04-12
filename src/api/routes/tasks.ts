import { Router } from 'express';
import { listTasks, createAndExecuteTask, stopTask } from '../controllers/taskController';

const router = Router();

router.get('/', listTasks);
router.post('/', createAndExecuteTask);
router.delete('/:id', stopTask);

export default router;
