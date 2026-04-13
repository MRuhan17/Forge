import React from 'react';
import { Box, Text } from 'ink';

interface FooterProps {
  feedback: string;
  apiConnected?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ feedback, apiConnected = true }) => {
  return (
    <Box paddingX={1} marginTop={1} justifyContent="space-between" borderStyle="single" borderTop={false} borderLeft={false} borderRight={false} borderBottom={false} borderColor="dim">
      <Box flexShrink={0} marginRight={2}>
        <Text color="blue" bold>
          TERMINAL
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
           Type /help for commands. ↑/↓ history
        </Text>
      </Box>
    </Box>
  );
};
