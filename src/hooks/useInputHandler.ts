import { useState, useEffect } from 'react';
import { useApp } from 'ink';
import { Tab, ViewState, Project, Experiment, Task, Activity, InputType, ParsedInput } from '../types';
import { CommandEngine } from '../services/CommandEngine';
import { AIEngine } from '../services/AIEngine';

const API = 'http://localhost:3001';

export interface InputHandlerState {
  activeTab: Tab;
  viewState: ViewState;
  selectedIndex: number;
  experimentIndex: number;
  currentInput: string;
  inputPrompt: string;
  history: string[];
  historyIndex: number;
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
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [viewState, setViewState] = useState<ViewState>({ type: 'list' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [experimentIndex, setExperimentIndex] = useState(0);

  const [currentInput, setCurrentInput] = useState('');
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
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

  const parseInput = (input: string): ParsedInput => {
    const trimmed = input.trim();
    if (trimmed.startsWith('/')) {
      return { type: 'command', payload: trimmed.slice(1).trim() };
    }
    return { type: 'nl', payload: trimmed };
  };

  const processTerminalInput = async (cmd: string, bypassSafety = false) => {
    if (!cmd.trim()) return;

    if (!bypassSafety && /delete|remove|reset/i.test(cmd)) {
      setPendingCommand(cmd);
      return;
    }

    const parsed = parseInput(cmd);
    
    const engineContext = {
      API,
      showFeedback,
      logActivity,
      setTasks,
      tasks,
      setProjects,
      projects,
      activeTab,
      viewState,
      selectedIndex,
      setActiveTab,
      setSelectedIndex,
      history,
      exit
    };

    if (parsed.type === 'command') {
      await CommandEngine.execute(parsed.payload, engineContext);
    } else {
      await AIEngine.handle(parsed.payload, engineContext);
    }
  };

  const handleInput = (input: string, key: any) => {
    if (key.escape) {
      if (currentInput.length > 0) {
        setCurrentInput('');
      } else {
        exit();
      }
      return;
    }

    if (key.tab && currentInput.startsWith('/')) {
      const candidates = CommandEngine.getAutocomplete(currentInput);
      if (candidates.length === 1) {
        setCurrentInput(candidates[0]);
      } else if (candidates.length > 1) {
        // Find common prefix length
        let i = 0;
        const first = candidates[0];
        while (i < first.length && candidates.every(c => c[i] === first[i])) {
          i++;
        }
        if (i > currentInput.length) {
          setCurrentInput(first.substring(0, i));
        } else {
          showFeedback(`Suggestions: ${candidates.map(c => c.trim()).join(', ')}`);
        }
      }
      return;
    }

    if (key.return) {
      if (pendingCommand) {
        const val = currentInput.trim().toLowerCase();
        if (val === 'y' || val === 'yes') {
          processTerminalInput(pendingCommand, true);
        } else {
          showFeedback('Command cancelled.');
        }
        setPendingCommand(null);
        setCurrentInput('');
        return;
      }

      if (currentInput.trim()) {
        const cmd = currentInput.trim();
        setHistory(prev => [cmd, ...prev]);
        processTerminalInput(cmd);
        setCurrentInput('');
        setHistoryIndex(-1);
      } else if (activeTab === 'projects' && projects.length > 0) {
        // Enter selects the actively highlighted project
        const p = projects[selectedIndex];
        setViewState({ type: 'project_detail', projectId: p.id });
        showFeedback(`Accessing project: ${p.name}`);
      }
      return;
    }

    if (key.upArrow) {
      if (currentInput.length === 0) {
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : projects.length - 1));
      } else if (history.length > 0) {
        setHistoryIndex(prev => {
          const next = prev < history.length - 1 ? prev + 1 : prev;
          setCurrentInput(history[next]);
          return next;
        });
      }
      return;
    }

    if (key.downArrow) {
      if (currentInput.length === 0) {
        setSelectedIndex(prev => (prev < projects.length - 1 ? prev + 1 : 0));
      } else {
        setHistoryIndex(prev => {
          if (prev > 0) {
            const next = prev - 1;
            setCurrentInput(history[next]);
            return next;
          } else if (prev === 0) {
            setCurrentInput('');
            return -1;
          }
          return prev;
        });
      }
      return;
    }
    
    // Left and right are reserved for tab switching in empty state
    if (key.leftArrow || key.rightArrow) {
      if (currentInput.length === 0) {
        if (viewState.type === 'list') {
          const tabs: Tab[] = ['projects', 'experiments', 'tasks', 'activities'];
          const idx = tabs.indexOf(activeTab);
          let newIdx = idx;
          if (key.leftArrow) newIdx = idx > 0 ? idx - 1 : tabs.length - 1;
          if (key.rightArrow) newIdx = idx < tabs.length - 1 ? idx + 1 : 0;
          setActiveTab(tabs[newIdx]);
          setSelectedIndex(0);
        }
      }
      return;
    }

    if (key.backspace || key.delete) {
      setCurrentInput(prev => prev.slice(0, -1));
      return;
    }

    if (input) {
      setCurrentInput(prev => prev + input);
    }
  };

  return {
    activeTab,
    viewState,
    selectedIndex,
    experimentIndex,
    currentInput,
    inputPrompt: pendingCommand ? 'Are you sure? (y/n) > ' : '>',
    history,
    historyIndex,
    feedback,
    projects,
    experiments,
    tasks,
    activities,
    apiConnected,
    handleInput
  };
};
