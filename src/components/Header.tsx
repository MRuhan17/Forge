import React from 'react';
import { Box, Text } from 'ink';
import { Tab } from '../types';

interface HeaderProps {
  activeTab: Tab;
}

export const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  return (
    <Box paddingX={1} paddingY={1} borderStyle="single" borderColor="cyan" justifyContent="space-between">
      <Text bold color="cyan">Forge TUI</Text>
      <Box>
        <Text color={activeTab === 'projects' ? 'green' : 'gray'}>[ projects ]  </Text>
        <Text color={activeTab === 'experiments' ? 'green' : 'gray'}>[ experiments ]  </Text>
        <Text color={activeTab === 'tasks' ? 'green' : 'gray'}>[ tasks ]</Text>
      </Box>
      <Text color="gray">q/ESC to exit</Text>
    </Box>
  );
};
