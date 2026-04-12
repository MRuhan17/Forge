import { useState, useEffect } from 'react';
import { useApp } from 'ink';
import { Tab, ViewState, InputMode, Project, Experiment, Task, Activity } from '../types';
import * as taskService from '../services/taskService';

const API = 'http://localhost:3001';

export interface InputHandlerState {
  mode: InputMode;
  activeTab: Tab;
  viewState: ViewState;
  selectedIndex: number;
  experimentIndex: number;
  inputValue: string;
  promptMsg: string;
  feedback: string;
  projects: Project[];
  experiments: Experiment[];
  tasks: Task[];
  activities: Activity[];
  apiConnected: boolean;
  handleInput: (input: string, key: any) => void;
}

export const useInputHandler = (): InputHandlerState => {
  const { exit } = useApp();
  const [mode, setMode] = useState<InputMode>('normal');
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [viewState, setViewState] = useState<ViewState>({ type: 'list' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [experimentIndex, setExperimentIndex] = useState(0);

  const [inputValue, setInputValue] = useState('');
  const [promptMsg, setPromptMsg] = useState('');
  const [feedback, setFeedback] = useState('');

  const [apiConnected, setApiConnected] = useState(true);

  // Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Load and poll data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, e, a, t] = await Promise.all([
          fetch(`${API}/projects`).then(r => r.json()),
          fetch(`${API}/experiments`).then(r => r.json()),
          fetch(`${API}/activities`).then(r => r.json()),
          fetch(`${API}/tasks`).then(r => r.json())
        ]);
        setProjects(p);
        setExperiments(e);
        setActivities(a);
        setTasks(t);
        setApiConnected(true);
      } catch (err: any) {
        setApiConnected(false);
      }
    };

    fetchData(); // Initial load
    const interval = setInterval(fetchData, 1000); // Poll every 1s
    return () => clearInterval(interval);
  }, []);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3000);
  };

  const startInput = (promptText: string) => {
    setPromptMsg(promptText);
    setInputValue('');
    setMode('input');
  };

  const startConfirm = (promptText: string) => {
    setPromptMsg(promptText);
    setMode('confirm');
  };

  const startCommand = () => {
    setPromptMsg(':');
    setInputValue('');
    setMode('command');
  };

  const handleCreate = () => {
    if (viewState.type === 'list') {
      if (activeTab === 'projects') startInput('Enter project name:');
      if (activeTab === 'experiments') startInput('Enter experiment name:');
      if (activeTab === 'tasks') startInput('Enter task name:');
    } else if (viewState.type === 'project_detail') {
      startInput('Enter experiment name for project:');
    }
  };

  const logActivity = async (message: string, type: string) => {
    try {
      const res = await fetch(`${API}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, type })
      });
      const act = await res.json();
      setActivities(prev => (act && act.id) ? [act, ...prev] : prev);
    } catch (e) {
      // Ignore strictly
    }
  };

  const executeCreate = async (name: string) => {
    try {
      if (viewState.type === 'list') {
        if (activeTab === 'projects') {
          const res = await fetch(`${API}/projects`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
          });
          const newObj = await res.json();
          setProjects([newObj, ...projects]);
          await logActivity(`Created project '${name}'`, 'create');
          showFeedback(`Created project: ${name}`);
        } else if (activeTab === 'experiments') {
          showFeedback('Experiments must be created inside a Project detail view.');
        } else if (activeTab === 'tasks') {
          const res = await fetch(`${API}/tasks`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
          });
          const newObj = await res.json();
          setTasks([newObj, ...tasks]);
          await logActivity(`Created task '${name}'`, 'create');
          showFeedback(`Created task: ${name}`);
        }
      } else if (viewState.type === 'project_detail') {
        const res = await fetch(`${API}/experiments`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId: viewState.projectId, name })
        });
        const newObj = await res.json();
        setExperiments([newObj, ...experiments]);
        await logActivity(`Created experiment '${name}'`, 'create');
        showFeedback(`Created experiment: ${name}`);
      }
    } catch (err: any) {
      showFeedback(`Error: ${err.message}`);
    }
  };

  const executeCommand = async (cmd: string) => {
    try {
      if (cmd.startsWith('new project ')) {
        const name = cmd.replace('new project ', '').trim();
        if (name) {
          const res = await fetch(`${API}/projects`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
          });
          const newObj = await res.json();
          setProjects([newObj, ...projects]);
          await logActivity(`Created project '${name}'`, 'create');
          showFeedback(`Created project: ${name}`);
        }
      } else if (cmd === 'delete project') {
        if (activeTab === 'projects' && viewState.type === 'list' && projects.length > 0) {
           const p = projects[selectedIndex];
           await fetch(`${API}/projects/${p.id}`, { method: 'DELETE' });
           setProjects(projects.filter(x => x.id !== p.id));
           setSelectedIndex(Math.max(0, selectedIndex - 1));
           await logActivity(`Deleted project '${p.name}'`, 'delete');
           showFeedback(`Deleted project`);
        } else {
           showFeedback('Must be viewing projects list to delete project');
        }
      } else if (cmd.startsWith('new exp ')) {
        if (viewState.type === 'project_detail') {
          const name = cmd.replace('new exp ', '').trim();
          if (name) {
            const res = await fetch(`${API}/experiments`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ projectId: viewState.projectId, name })
            });
            const newObj = await res.json();
            setExperiments([newObj, ...experiments]);
            await logActivity(`Created experiment '${name}'`, 'create');
            showFeedback(`Created experiment: ${name}`);
          }
        } else {
          showFeedback('Must be inside a project to create an experiment');
        }
      } else if (cmd === 'help') {
        showFeedback('Commands: new project <name> | delete project | new exp <name> | help');
      } else {
        showFeedback(`Unknown command: ${cmd}`);
      }
    } catch (err: any) {
      showFeedback(`Command Error: ${err.message}`);
    }
  };

  const handleDelete = () => {
    if (viewState.type === 'project_detail') {
      const projExperiments = experiments.filter(e => e.projectId === viewState.projectId);
      if (projExperiments.length > 0) {
         startConfirm(`Delete experiment ${projExperiments[experimentIndex].name}? (y/n)`);
      }
      return;
    }

    if (viewState.type !== 'list') return;

    if (activeTab === 'projects' && projects.length > 0) startConfirm(`Delete project ${projects[selectedIndex].name}? (y/n)`);
    if (activeTab === 'experiments' && experiments.length > 0) startConfirm(`Delete experiment ${experiments[selectedIndex].name}? (y/n)`);
    if (activeTab === 'tasks' && tasks.length > 0) startConfirm(`Delete task ${tasks[selectedIndex].name}? (y/n)`);
  };

  const executeDelete = async () => {
    try {
      if (viewState.type === 'project_detail') {
         const projExperiments = experiments.filter(e => e.projectId === viewState.projectId);
         const target = projExperiments[experimentIndex];
         await fetch(`${API}/experiments/${target.id}`, { method: 'DELETE' });
         setExperiments(experiments.filter(x => x.id !== target.id));
         setExperimentIndex(Math.max(0, experimentIndex - 1));
         await logActivity(`Deleted experiment '${target.name}'`, 'delete');
         showFeedback(`Deleted experiment`);
         return;
      }

      if (activeTab === 'projects') {
        const p = projects[selectedIndex];
        await fetch(`${API}/projects/${p.id}`, { method: 'DELETE' });
        const next = projects.filter(x => x.id !== p.id);
        setProjects(next);
        setSelectedIndex(Math.max(0, selectedIndex - 1));
        await logActivity(`Deleted project '${p.name}'`, 'delete');
        showFeedback(`Deleted project`);
      } else if (activeTab === 'experiments') {
        const e = experiments[selectedIndex];
        await fetch(`${API}/experiments/${e.id}`, { method: 'DELETE' });
        setExperiments(experiments.filter(x => x.id !== e.id));
        setSelectedIndex(Math.max(0, selectedIndex - 1));
        await logActivity(`Deleted experiment '${e.name}'`, 'delete');
        showFeedback(`Deleted experiment`);
      } else if (activeTab === 'tasks') {
        const t = tasks[selectedIndex];
        await fetch(`${API}/tasks/${t.id}`, { method: 'DELETE' });
        setTasks(tasks.filter(x => x.id !== t.id));
        setSelectedIndex(Math.max(0, selectedIndex - 1));
        await logActivity(`Deleted task '${t.name}'`, 'delete');
        showFeedback(`Deleted task`);
      }
    } catch (err: any) {
      showFeedback(`Error: ${err.message}`);
    }
  };

  const handleArrowNav = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (viewState.type === 'project_detail') {
      if (dir === 'left' || dir === 'right') return;
      const projExperiments = experiments.filter(e => e.projectId === viewState.projectId);
      const max = projExperiments.length;
      if (max === 0) return;
      if (dir === 'up') setExperimentIndex(s => (s > 0 ? s - 1 : max - 1));
      if (dir === 'down') setExperimentIndex(s => (s < max - 1 ? s + 1 : 0));
      return;
    }

    if (viewState.type !== 'list') return;

    if (dir === 'left' || dir === 'right') {
      const tabs: Tab[] = ['projects', 'experiments', 'tasks', 'activities'];
      const idx = tabs.indexOf(activeTab);
      let newIdx = idx;
      if (dir === 'left') newIdx = idx > 0 ? idx - 1 : tabs.length - 1;
      if (dir === 'right') newIdx = idx < tabs.length - 1 ? idx + 1 : 0;
      setActiveTab(tabs[newIdx]);
      setSelectedIndex(0);
      showFeedback(`Switched to ${tabs[newIdx]} tab`);
    } else {
      let max = 0;
      if (activeTab === 'projects') max = projects.length;
      if (activeTab === 'experiments') max = experiments.length;
      if (activeTab === 'tasks') max = tasks.length;

      if (max === 0) return;

      if (dir === 'up') setSelectedIndex(s => (s > 0 ? s - 1 : max - 1));
      if (dir === 'down') setSelectedIndex(s => (s < max - 1 ? s + 1 : 0));
    }
  };

  const handleInput = (input: string, key: any) => {
    if (key.escape) {
      if (mode !== 'normal') {
        setMode('normal');
        showFeedback('Cancelled');
        return;
      }
      if (viewState.type === 'project_detail') {
        setViewState({ type: 'list' });
        showFeedback('Returned to layout');
        return;
      }
      exit();
      return;
    }

    if (mode === 'confirm') {
      if (input.toLowerCase() === 'y') {
        executeDelete();
        setMode('normal');
      } else if (input.toLowerCase() === 'n') {
        setMode('normal');
        showFeedback('Cancelled delete');
      }
      return;
    }

    if (mode === 'command') {
      if (key.return) {
        if (inputValue.trim().length > 0) {
          executeCommand(inputValue.trim());
        }
        setMode('normal');
        setInputValue('');
      } else if (key.backspace || key.delete) {
        setInputValue(prev => prev.slice(0, -1));
      } else if (input) {
        setInputValue(prev => prev + input);
      }
      return;
    }

    if (mode === 'input') {
      if (key.return) {
        if (inputValue.trim().length > 0) {
          executeCreate(inputValue.trim());
        } else {
          showFeedback('Name cannot be empty.');
        }
        setMode('normal');
        setInputValue('');
      } else if (key.backspace || key.delete) {
        setInputValue(prev => prev.slice(0, -1));
      } else if (input && /^[a-zA-Z0-9 _-]+$/.test(input)) {
        setInputValue(prev => prev + input);
      }
      return;
    }

    if (mode === 'normal') {
      if (input === ':') return startCommand();
      if (input === 'q') return exit();
      if (key.leftArrow) handleArrowNav('left');
      if (key.rightArrow) handleArrowNav('right');
      if (key.upArrow) handleArrowNav('up');
      if (key.downArrow) handleArrowNav('down');
      if (input === 'n') handleCreate();
      if (input === 'd') handleDelete();

      if (key.return && viewState.type === 'list' && activeTab === 'projects' && projects.length > 0) {
        const pName = projects[selectedIndex].name;
        setViewState({ type: 'project_detail', projectId: projects[selectedIndex].id });
        setExperimentIndex(0);
        showFeedback(`Viewing project: ${pName}`);
      }
    }
  };

  return {
    mode,
    activeTab,
    viewState,
    selectedIndex,
    experimentIndex,
    inputValue,
    promptMsg,
    feedback,
    projects,
    experiments,
    tasks,
    activities,
    apiConnected,
    handleInput
  };
};
