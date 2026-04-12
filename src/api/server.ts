import express from 'express';
import cors from 'cors';
import projectsRouter from './routes/projects';
import experimentsRouter from './routes/experiments';
import activitiesRouter from './routes/activities';
import tasksRouter from './routes/tasks';

const app = express();
app.use(cors());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.json());

// Error handler for malformed JSON
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    console.error('JSON Parse Error:', err.message);
    const bodyStr = String((err as any).body || '');
    console.error('Raw Body hint:', bodyStr.slice(0, 100));
    return res.status(400).send({ error: 'Malformed JSON' });
  }
  next();
});

app.use('/projects', projectsRouter);
app.use('/experiments', experimentsRouter);
app.use('/activities', activitiesRouter);
app.use('/tasks', tasksRouter);

export const startServer = (port: number = 3001): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(port, () => {
        resolve();
      });
      server.on('error', (err: any) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
};
