import React from 'react';
import { Box, Text } from 'ink';
import { Activity } from '../types';
import { formatTime, getLogColor, getLogPrefix } from '../utils/formatters';

interface TerminalOutputProps {
  logs: Activity[];
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ logs }) => {
  // Focus on the most recent events
  const displayLogs = [...logs].slice(0, 15);

  return (
    <Box flexDirection="column" width="100%">
      <Box flexGrow={1} flexDirection="column">
        {displayLogs.length === 0 ? (
          <Text color="gray">No events recorded.</Text>
        ) : (
          displayLogs.map((log) => {
            const color = getLogColor(log.type);
            const prefix = getLogPrefix(log.type);
            const timeStr = formatTime(log.createdAt);

            return (
              <Box key={log.id} flexDirection="row" marginBottom={0}>
                <Box width={10} marginRight={1}>
                  <Text color="gray" dimColor>{timeStr}</Text>
                </Box>
                <Box width={2}>
                  <Text color={color} bold>{prefix}</Text>
                </Box>
                <Box flexShrink={1}>
                  <Text color={log.type === 'ai' || log.type === 'error' ? 'white' : 'gray'}>
                    {log.message}
                  </Text>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};
