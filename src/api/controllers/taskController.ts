import { Request, Response } from 'express';
import * as taskService from '../../services/taskService';

const RUST_ENGINE = 'http://localhost:3002';

export const listTasks = async (req: Request, res: Response) => {
  try {
    // Merge DB tasks with Rust engine live tasks
    const dbTasks = taskService.getTasks();
    const rustRes = await fetch(`${RUST_ENGINE}/tasks`);
    const rustTasks = await rustRes.json() as any[];

    // Simple merge logic: Rust takes priority for status and progress if IDs match
    const merged = dbTasks.map(dt => {
      const rt = rustTasks.find(r => r.id === dt.id);
      return rt ? { 
        ...dt, 
        status: rt.status,
        progress: rt.progress,
        createdAt: rt.timestamp || dt.createdAt
      } : dt;
    });

    res.json(merged);
  } catch (e) {
    res.json(taskService.getTasks());
  }
};

export const createAndExecuteTask = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const task = taskService.createTask(name);

    // Trigger Rust execution
    fetch(`${RUST_ENGINE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, id: task.id }) // Pass ID to link them
    }).catch(console.error); // Async fire-and-forget

    res.status(201).json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const stopTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await fetch(`${RUST_ENGINE}/tasks/${id}`, { method: 'DELETE' });
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
