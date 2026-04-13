import { Tab, ViewState, Project, Task } from '../types';

export interface EngineContext {
  API: string;
  showFeedback: (msg: string) => void;
  logActivity: (msg: string, type: string) => Promise<void>;
  setTasks: (tasks: Task[]) => void;
  tasks: Task[];
  setProjects: (projects: Project[]) => void;
  projects: Project[];
  activeTab: Tab;
  viewState: ViewState;
  selectedIndex: number;
  setActiveTab: (tab: Tab) => void;
  setSelectedIndex: (idx: number) => void;
  history: string[];
  exit: () => void;
}

export interface CommandDef {
  name: string;
  description: string;
  subcommands?: string[];
  handler: (args: string[], context: EngineContext) => Promise<void> | void;
}

export class CommandEngine {
  private static registry = new Map<string, CommandDef>();

  static register(cmd: CommandDef) {
    this.registry.set(cmd.name.toLowerCase(), cmd);
  }

  static getCommands(): CommandDef[] {
    return Array.from(this.registry.values());
  }

  static getAutocomplete(input: string): string[] {
    if (!input.startsWith('/')) return [];
    
    // Command parts without '/'
    const parts = input.slice(1).toLowerCase().split(/\s+/);
    const cmdPrefix = parts[0];
    
    // e.g. "/ta"
    if (parts.length === 1) {
      return this.getCommands()
        .filter(c => c.name.startsWith(cmdPrefix))
        .map(c => `/${c.name} `);
    } 
    // e.g. "/task ru"
    else if (parts.length === 2 && input.endsWith(parts[1])) {
      const cmd = this.registry.get(cmdPrefix);
      if (cmd && cmd.subcommands) {
        const subPrefix = parts[1];
        return cmd.subcommands
          .filter(s => s.startsWith(subPrefix))
          .map(s => `/${cmd.name} ${s} `);
      }
    }
    
    return [];
  }

  static async execute(cmdString: string, context: EngineContext) {
    const parts = cmdString.trim().split(/\s+/);
    if (!parts.length || !parts[0]) return;

    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const cmd = this.registry.get(cmdName);
    if (cmd) {
      try {
        await cmd.handler(args, context);
      } catch (err: any) {
        context.showFeedback(`Error executing /${cmdName}: ${err.message}`);
        await context.logActivity(`Execution failed: ${err.message}`, 'error');
      }
    } else {
      context.showFeedback(`Unknown command: /${cmdName}`);
    }
  }
}

// Built-in sample commands implementation
CommandEngine.register({
  name: 'project',
  description: 'Manage projects (create, delete, list)',
  subcommands: ['create', 'delete'],
  handler: async (args, context) => {
    const [action, ...restArgs] = args;
    const { API, setProjects, projects, logActivity, showFeedback, activeTab, viewState, selectedIndex } = context;

    if (action === 'create') {
      const name = restArgs.join(' ');
      if (!name) return showFeedback('Usage: /project create <name>');
      
      const res = await fetch(`${API}/projects`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const newObj = await res.json();
      setProjects([newObj, ...projects]);
      await logActivity(`Created project '${name}'`, 'create');
      showFeedback(`Created project: ${name}`);
    } else if (action === 'delete') {
      if (activeTab === 'projects' && viewState.type === 'list' && projects.length > 0) {
         const p = projects[selectedIndex];
         if (!p) return;
         try {
           await fetch(`${API}/projects/${p.id}`, { method: 'DELETE' });
           setProjects(projects.filter(x => x.id !== p.id));
           context.setSelectedIndex(Math.max(0, selectedIndex - 1));
           await logActivity(`Deleted project '${p.name}'`, 'success');
           showFeedback(`Deleted project`);
         } catch(err: any) {
           showFeedback(`Error: ${err.message}`);
           await logActivity(err.message, 'error');
         }
      } else {
         showFeedback('Must be viewing projects list to delete project');
      }
    } else {
      showFeedback('Usage: /project create <name> | /project delete');
    }
  }
});

CommandEngine.register({
  name: 'task',
  description: 'Manage tasks (create, run)',
  subcommands: ['create', 'run'],
  handler: async (args, context) => {
    const [action, ...restArgs] = args;
    const { API, setTasks, tasks, logActivity, showFeedback } = context;

    if (action === 'create') {
      const name = restArgs.join(' ');
      if (!name) return showFeedback('Usage: /task create <name>');
      
      try {
        const res = await fetch(`${API}/tasks`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name })
        });
        const newObj = await res.json();
        setTasks([newObj, ...tasks]);
        await logActivity(`Created task '${name}'`, 'success');
        showFeedback(`Created task: ${name}`);
      } catch (err: any) {
        context.showFeedback(`Command Error: ${err.message}`);
        await logActivity(err.message, 'error');
      }
    } else if (action === 'run') {
      const name = restArgs.join(' ');
      if (!name) return showFeedback('Usage: /task run <name>');
      
      // Implement execution flow logic example
      showFeedback(`Running task pipeline for: ${name}`);
      await logActivity(`/${name}`, 'command');
    } else {
      showFeedback('Usage: /task create <name> | /task run <name>');
    }
  }
});

CommandEngine.register({
  name: 'exp',
  description: 'Manage experiments',
  subcommands: ['create'],
  handler: async (args, context) => {
    const [action, ...restArgs] = args;
    const name = restArgs.join(' ');
    
    if (action === 'create') {
      if (!name) return context.showFeedback('Usage: /exp create <name>');
      
      // Extensible mocked logic
      context.showFeedback(`Mock creating experiment: ${name}`);
      await context.logActivity(`Created experiment '${name}'`, 'create');
    } else {
      context.showFeedback('Usage: /exp create <name>');
    }
  }
});

CommandEngine.register({
  name: 'tab',
  description: 'Switch tab',
  subcommands: ['projects', 'experiments', 'tasks', 'activities'],
  handler: (args, context) => {
    if (args.length === 0) {
      context.showFeedback('Usage: /tab <name>');
      return;
    }
    const tabName = args[0].toLowerCase();
    if (['projects', 'experiments', 'tasks', 'activities'].includes(tabName)) {
      context.setActiveTab(tabName as Tab);
      context.setSelectedIndex(0);
      context.showFeedback(`Switched to ${tabName}`);
    } else {
      context.showFeedback(`Unknown tab: ${tabName}`);
    }
  }
});

CommandEngine.register({
  name: 'quit',
  description: 'Exit application',
  handler: (_, context) => {
    context.exit();
  }
});

CommandEngine.register({
  name: 'exit',
  description: 'Exit application',
  handler: (_, context) => {
    context.exit();
  }
});

CommandEngine.register({
  name: 'help',
  description: 'List all commands',
  handler: (_, context) => {
    const cmds = CommandEngine.getCommands().map(c => `/${c.name}`).join(' ');
    context.showFeedback(`Commands: ${cmds}`);
  }
});
