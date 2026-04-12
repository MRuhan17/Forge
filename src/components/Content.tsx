import React from 'react';
import { Box, Text } from 'ink';
import { Tab, ViewState, Project, Experiment, Task, Activity } from '../types';

interface ContentProps {
  activeTab: Tab;
  viewState: ViewState;
  selectedIndex: number;
  experimentIndex: number;
  projects: Project[];
  experiments: Experiment[];
  tasks: Task[];
  activities: Activity[];
}

export const Content: React.FC<ContentProps> = ({
  activeTab,
  viewState,
  selectedIndex,
  experimentIndex,
  projects,
  experiments,
  tasks,
  activities
}) => {
  if (viewState.type === 'project_detail') {
    const p = projects.find(x => x.id === viewState.projectId);
    if (!p) return <Text color="red">Project not found</Text>;
    
    // Get experiments strictly for this project
    const projExperiments = experiments.filter(e => e.projectId === p.id);

    return (
      <Box flexDirection="column">
        <Box borderStyle="single" borderTop={false} borderLeft={false} borderRight={false} paddingBottom={1} marginBottom={1} borderColor="gray">
          <Text bold color="yellow">Project Details: </Text><Text color="white">{p.name}</Text>
        </Box>
        <Text color="gray">ID: <Text color="white">{p.id}</Text></Text>
        <Text color="gray">Path: <Text color="cyan">{p.path}</Text></Text>
        <Text color="gray">Created: <Text color="white">{new Date(p.createdAt).toLocaleString()}</Text></Text>
        
        <Box marginTop={1} flexDirection="column">
           <Text bold color="green" underline>Experiments ({projExperiments.length}):</Text>
           {projExperiments.length === 0 ? (
             <Text color="gray">  No experiments yet. Press 'n' to create one.</Text>
           ) : (
             projExperiments.map((e, idx) => {
               const isSel = idx === experimentIndex;
               return (
                 <Box key={e.id} flexDirection="row">
                   <Box width={3}>
                     <Text color="cyan" bold>{isSel ? '> ' : '  '}</Text>
                   </Box>
                   <Text color={isSel ? 'white' : 'gray'}>{e.name}</Text>
                 </Box>
               );
             })
           )}
        </Box>
        <Box marginTop={2}>
           <Text color="gray">Press '<Text color="white">ESC</Text>' to return to list.</Text>
        </Box>
      </Box>
    );
  }

  // List Views
  const renderList = (items: any[], renderItem: (item: any, isSelected: boolean) => React.ReactNode, name: string) => {
     if (items.length === 0) {
       return (
         <Box flexGrow={1} alignItems="center" justifyContent="center" height="100%" paddingTop={2} flexDirection="column">
           <Text color="gray">No {name} found.</Text>
           <Text color="gray">Press '<Text color="white">n</Text>' to create one.</Text>
         </Box>
       );
     }
     return (
       <Box flexDirection="column">
         {items.map((item, idx) => {
           const isSelected = idx === selectedIndex;
           return (
             <Box key={item.id} marginBottom={1} flexDirection="row">
               <Box width={3}>
                 <Text color="cyan" bold>{isSelected ? '> ' : '  '}</Text>
               </Box>
               {renderItem(item, isSelected)}
             </Box>
           );
         })}
       </Box>
     );
  };

  if (activeTab === 'projects') {
    return renderList(projects, (p: Project, sel) => (
      <Box flexDirection="column">
        <Text color={sel ? 'white' : 'gray'} bold>{p.name}</Text>
        <Text color={sel ? 'cyan' : 'gray'}>{p.path}</Text>
      </Box>
    ), 'projects');
  }

  if (activeTab === 'experiments') {
    return renderList(experiments, (e: Experiment, sel) => (
      <Box flexDirection="column">
        <Text color={sel ? 'white' : 'gray'} bold>{e.name}</Text>
      </Box>
    ), 'experiments');
  }

  if (activeTab === 'tasks') {
    return renderList(tasks, (t: Task, sel) => {
      let icon = '…';
      let iconColor = 'yellow';
      let statusText = 'pending';
      
      if (t.status === 'running') { icon = '⏳'; iconColor = 'cyan'; statusText = 'running'; }
      if (t.status === 'completed') { icon = '✔'; iconColor = 'green'; statusText = 'completed'; }
      if (t.status === 'failed') { icon = '✖'; iconColor = 'red'; statusText = 'failed'; }

      const renderProgressBar = (progress: number = 0) => {
        const width = 10;
        const filledWidth = Math.floor((progress / 100) * width);
        const emptyWidth = width - filledWidth;
        return `[${'█'.repeat(filledWidth)}${'░'.repeat(emptyWidth)}] ${progress}%`;
      };

      return (
        <Box flexDirection="column" width="100%">
          <Box justifyContent="space-between" width="100%">
            <Box>
              <Text color={sel ? 'white' : 'gray'} bold>{t.name}</Text>
            </Box>
            <Box>
              <Text color={iconColor}>{icon} </Text>
              <Text color={iconColor}>{statusText}</Text>
            </Box>
          </Box>
          <Box>
            {t.status === 'running' && (
              <Box marginRight={2}>
                <Text color="cyan">{renderProgressBar(t.progress || 0)}</Text>
              </Box>
            )}
            <Text color="gray">{new Date(t.createdAt).toLocaleString()}</Text>
          </Box>
        </Box>
      );
    }, 'tasks');
  }

  if (activeTab === 'activities') {
    return renderList(activities, (a: Activity, sel) => {
      let icon = 'ℹ';
      let iconColor = 'blue';
      if (a.type === 'create') { icon = '✔'; iconColor = 'green'; }
      if (a.type === 'delete') { icon = '✖'; iconColor = 'red'; }
      if (a.type === 'update') { icon = '⏳'; iconColor = 'yellow'; }

      return (
        <Box flexDirection="column">
          <Box>
             <Text color={iconColor}>{icon} </Text>
             <Text color={sel ? 'white' : 'gray'} bold>{a.message}</Text>
          </Box>
          <Text color="gray">{new Date(a.createdAt).toLocaleTimeString()}</Text>
        </Box>
      );
    }, 'activities');
  }

  return null;
};
