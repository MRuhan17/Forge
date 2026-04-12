import React from 'react';
import { Box, useInput } from 'ink';
import { Header } from './components/Header';
import { Content } from './components/Content';
import { Footer } from './components/Footer';
import { InputBox } from './components/InputBox';
import { ActivityFeed } from './components/ActivityFeed';
import { useInputHandler } from './hooks/useInputHandler';

const App = () => {
  const state = useInputHandler();

  useInput((input, key) => {
    state.handleInput(input, key);
  });

  return (
    <Box flexDirection="column" height="100%">
      <Header activeTab={state.activeTab} />
      
      <Box flexGrow={1} flexDirection="row">
        <Box width="70%" paddingX={2} paddingY={1} borderStyle="round" borderColor="dim" flexDirection="column">
          <Content 
            activeTab={state.activeTab}
            viewState={state.viewState}
            selectedIndex={state.selectedIndex}
            experimentIndex={state.experimentIndex}
            projects={state.projects}
            experiments={state.experiments}
            tasks={state.tasks}
            activities={state.activities}
          />
          {state.mode !== 'normal' && (
            <InputBox prompt={state.promptMsg} value={state.inputValue} />
          )}
        </Box>
        
        <ActivityFeed activities={state.activities} />
      </Box>

      <Footer feedback={state.feedback} mode={state.mode} apiConnected={state.apiConnected} />
    </Box>
  );
};

export default App;
