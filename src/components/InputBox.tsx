import React from 'react';
import { Box, Text } from 'ink';

interface InputBoxProps {
  prompt: string;
  value: string;
}

export const InputBox: React.FC<InputBoxProps> = ({ prompt, value }) => {
  return (
    <Box paddingY={0}>
      <Text bold color="blue">{prompt} </Text>
      <Text color="white">{value}</Text>
      <Text color="white" inverse>_</Text>
    </Box>
  );
};
