import { Request, Response } from 'express';
import * as experimentService from '../../services/experimentService';

export const listExperiments = (req: Request, res: Response) => {
  try {
    const data = experimentService.getExperiments();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createExperiment = (req: Request, res: Response) => {
  try {
    const { projectId, name } = req.body;
    if (!name || !projectId) return res.status(400).json({ error: 'Missing logic' });
    const e = experimentService.createExperiment(projectId, name);
    res.json(e);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteExperiment = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    experimentService.deleteExperiment(id as string);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
