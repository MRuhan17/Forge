import React from 'react';
import { Box, Text } from 'ink';

interface InputBoxProps {
  prompt: string;
  value: string;
}

export const InputBox: React.FC<InputBoxProps> = ({ prompt, value }) => {
  return (
    <Box paddingX={1} marginTop={1} borderStyle="single" borderColor="green">
      <Text bold color="yellow">{prompt}</Text>
      <Text color="white"> {value}</Text>
      <Text color="gray">█</Text>
    </Box>
  );
};
