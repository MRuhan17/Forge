export interface Project {
  id: string;
  name: string;
  path: string;
  createdAt: string;
}

export interface Experiment {
  id: string;
  projectId: string;
  name: string;
  notes: string | null;
  createdAt: string;
}

export interface Task {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress?: number;
  createdAt: string;
}

export type Tab = 'projects' | 'experiments' | 'tasks' | 'activities';

export type ActivityType = 'create' | 'delete' | 'update' | 'system';

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  createdAt: string;
}

export type InputMode = 'normal' | 'input' | 'confirm' | 'command';

export type ViewState = 
  | { type: 'list' }
  | { type: 'project_detail'; projectId: string };
