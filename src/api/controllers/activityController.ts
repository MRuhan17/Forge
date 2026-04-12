import { Request, Response } from 'express';
import * as activityService from '../../services/activityService';

export const listActivities = (req: Request, res: Response) => {
  try {
    const data = activityService.getRecentActivities();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createActivity = (req: Request, res: Response) => {
  try {
    const { message, type } = req.body;
    const data = activityService.log(message, type);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
