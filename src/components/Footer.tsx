import React from 'react';
import { Box, Text } from 'ink';
import { InputMode } from '../types';

interface FooterProps {
  feedback: string;
  mode: InputMode;
  apiConnected?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ feedback, mode, apiConnected = true }) => {
  return (
    <Box paddingX={1} marginTop={1} justifyContent="space-between" borderStyle="single" borderTop={false} borderLeft={false} borderRight={false} borderBottom={false} borderColor="dim">
      <Box flexShrink={0} marginRight={2}>
        <Text color={mode === 'normal' ? 'blue' : 'yellow'} bold>
          {mode.toUpperCase()}
        </Text>
        <Text color="gray"> │ </Text>
        <Text color={apiConnected ? 'green' : 'red'}>
          {apiConnected ? 'API: OK' : 'API: ERR'}
        </Text>
      </Box>

      <Box flexGrow={1}>
         <Text color={feedback.startsWith('Error') || feedback.startsWith('API Error') ? 'red' : 'green'}>
            {feedback}
         </Text>
      </Box>

      <Box flexShrink={0}>
        <Text color="gray">
           {mode === 'normal' && '[:] cmd | [n] new | [d] del | [q] quit'}
           {mode === 'input' && 'Enter: confirm | ESC: cancel'}
           {mode === 'confirm' && 'y/n: confirm | ESC: cancel'}
           {mode === 'command' && 'Enter to run | ESC to cancel'}
        </Text>
      </Box>
    </Box>
  );
};
