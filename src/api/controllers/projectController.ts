import { Request, Response } from 'express';
import * as projectService from '../../services/projectService';

export const listProjects = (req: Request, res: Response) => {
  try {
    const data = projectService.getProjects();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createProject = (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const p = projectService.createProject(name);
    res.json(p);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProject = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    projectService.deleteProject(id as string);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
