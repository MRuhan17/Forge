import React from 'react';
import { Box, Text } from 'ink';
import { Activity } from '../types';

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <Box flexDirection="column" paddingX={1} width="30%" borderStyle="round" borderColor="dim">
      <Box borderStyle="single" borderTop={false} borderLeft={false} borderRight={false} paddingBottom={1} marginBottom={1} borderColor="gray">
        <Text bold color="cyan">Activity Feed</Text>
      </Box>
      {activities.length === 0 ? (
        <Text color="gray">No activity yet.</Text>
      ) : (
        activities.slice(0, 8).map((a) => {
          let icon = 'ℹ';
          let iconColor = 'blue';
          if (a.type === 'create') { icon = '✔'; iconColor = 'green'; }
          if (a.type === 'delete') { icon = '✖'; iconColor = 'red'; }
          if (a.type === 'update') { icon = '⏳'; iconColor = 'yellow'; }

          return (
            <Box key={a.id} flexDirection="column" marginBottom={1}>
              <Box>
                <Text color={iconColor}>{icon} </Text>
                <Text color="gray">{a.message}</Text>
              </Box>
            </Box>
          );
        })
      )}
    </Box>
  );
};
