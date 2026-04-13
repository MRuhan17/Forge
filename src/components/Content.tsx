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
}) => {
  if (viewState.type === 'project_detail') {
    const p = projects.find(x => x.id === viewState.projectId);
    if (!p) return <Text color="red">Project not found</Text>;
    const projExperiments = experiments.filter(e => e.projectId === p.id);

    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="white">{p.name.toUpperCase()}</Text>
        </Box>
        <Box flexDirection="column" gap={0}>
          <Text color="gray">Path   <Text color="white">{p.path}</Text></Text>
          <Text color="gray">ID     <Text color="white">{p.id.slice(0,8)}...</Text></Text>
          <Text color="gray">Status <Text color="green">Active</Text></Text>
        </Box>
        
        <Box marginTop={2} flexDirection="column">
           <Text color="gray" dimColor marginBottom={1}>EXPERIMENTS</Text>
           {projExperiments.length === 0 ? (
             <Text color="gray">  None</Text>
           ) : (
             projExperiments.map((e, idx) => {
               const isSel = idx === experimentIndex;
               return (
                 <Box key={e.id} flexDirection="row" paddingX={1} marginBottom={0}>
                   <Text color={isSel ? 'blue' : 'gray'} bold>{isSel ? '→ ' : '  '}</Text>
                   <Text inverse={isSel} color={isSel ? 'white' : 'white'}> {e.name} </Text>
                 </Box>
               );
             })
           )}
        </Box>
      </Box>
    );
  }

  const renderList = (items: any[], renderItem: (item: any, isSelected: boolean) => React.ReactNode, name: string) => {
     if (items.length === 0) {
       return <Text color="gray">No {name} found.</Text>;
     }
     return (
       <Box flexDirection="column" width="100%">
         {items.map((item, idx) => {
           const isSelected = idx === selectedIndex;
           return (
             <Box key={item.id} marginBottom={0} paddingX={1} width="100%">
               <Box width="100%">
                 {renderItem(item, isSelected)}
               </Box>
             </Box>
           );
         })}
       </Box>
     );
  };

  if (activeTab === 'projects') {
    return renderList(projects, (p: Project, sel) => (
      <Box flexDirection="row" width="100%">
        <Text color={sel ? 'blue' : 'gray'} bold>{sel ? '→ ' : '  '}</Text>
        <Box flexDirection="column">
          <Text inverse={sel} color="white"> {p.name} </Text>
          {!sel && <Text color="gray" dimColor>  {p.path}</Text>}
        </Box>
      </Box>
    ), 'projects');
  }

  if (activeTab === 'experiments') {
    return renderList(experiments, (e: Experiment, sel) => (
      <Box flexDirection="row">
        <Text color={sel ? 'blue' : 'gray'} bold>{sel ? '→ ' : '  '}</Text>
        <Text inverse={sel} color="white"> {e.name} </Text>
      </Box>
    ), 'experiments');
  }

  if (activeTab === 'tasks') {
    return renderList(tasks, (t: Task, sel) => {
      let statusColor = 'gray';
      if (t.status === 'running') statusColor = 'blue';
      if (t.status === 'completed') statusColor = 'green';
      if (t.status === 'failed') statusColor = 'red';

      return (
        <Box flexDirection="row" width="100%" justifyContent="space-between">
          <Box>
            <Text color={sel ? 'blue' : 'gray'} bold>{sel ? '→ ' : '  '}</Text>
            <Text inverse={sel} color="white"> {t.name} </Text>
          </Box>
          <Box>
            <Text color={statusColor} dimColor={!sel}>[{t.status.toUpperCase()}]</Text>
          </Box>
        </Box>
      );
    }, 'tasks');
  }

  if (activeTab === 'activities') {
    return <Text color="gray">System logs are visible in the Activity Stream panel.</Text>;
  }

  return null;
};
