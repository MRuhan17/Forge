import React from 'react';
import { Box, useInput, Text } from 'ink';
import { useInputHandler } from './hooks/useInputHandler';

/**
 * FORGE WORKSPACE - COMPLETELY NEW IMPLEMENTATION
 * Follows a strict minimal dev-tool aesthetic.
 */

const App = () => {
  const { 
    activeTab, currentInput, inputPrompt, projects, selectedIndex, 
    activities, apiConnected, handleInput, feedback 
  } = useInputHandler();

  useInput((input, key) => {
    handleInput(input, key);
  });

  return (
    <Box flexDirection="column" height="100%" padding={1}>
      
      {/* 1. LAYER: MINIMAL WORKSPACE HEADER */}
      <Box marginBottom={1}>
        <Text bold color="white">Forge</Text>
        <Box flexGrow={1} />
        <Text color={apiConnected ? 'gray' : 'red'}>
          {apiConnected ? '[Connected]' : '[Offline]'}
        </Text>
      </Box>

      {/* 2. LAYER: WORKSPACE SPLIT VIEW */}
      <Box flexGrow={1} flexDirection="row">
        
        {/* NAVIGATION PANEL */}
        <Box width="40%" flexDirection="column">
          <Box marginBottom={1}>
            <Text color="gray" dimColor>PROJECTS</Text>
          </Box>
          <Box flexDirection="column">
            {projects.map((p, idx) => {
              const active = idx === selectedIndex;
              return (
                <Box key={p.id} paddingLeft={active ? 0 : 2}>
                  {active && <Text color="blue">❯ </Text>}
                  <Text color={active ? 'white' : 'gray'}>{p.name}</Text>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* CONTENT / LOG PANEL */}
        <Box width="60%" flexDirection="column" paddingLeft={4}>
          <Box marginBottom={1}>
            <Text color="gray" dimColor>LOG_OUTPUT</Text>
          </Box>
          <Box flexDirection="column">
            {activities.slice(0, 20).map((log) => {
              const color = log.type === 'error' ? 'red' : log.type === 'ai' ? 'blue' : 'gray';
              return (
                <Box key={log.id} marginBottom={0}>
                  <Text color="gray" dimColor>
                    {new Date(log.createdAt).toLocaleTimeString([], { hour12: false })} 
                  </Text>
                  <Text color={color}> {log.message}</Text>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* 3. LAYER: FLOATING COMMAND BAR */}
      <Box flexDirection="column" marginTop={1}>
        {feedback && (
          <Text color="blue">● {feedback}</Text>
        )}
        <Box width="100%" marginTop={feedback ? 0 : 1}>
          <Text color="blue" bold>{inputPrompt} </Text>
          <Text color="white">{currentInput}</Text>
          <Text color="white" inverse>_</Text>
        </Box>
      </Box>
      
    </Box>
  );
};

export default App;
