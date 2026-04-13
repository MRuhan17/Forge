export const formatTime = (dateStr: string | number) => {
  const d = new Date(dateStr);
  return `[${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}]`;
};

export const getLogColor = (type: string): string => {
  switch (type) {
    case 'command': return 'green';
    case 'ai': return 'magenta';
    case 'error': return 'red';
    case 'system': return 'cyan';
    case 'success': return 'greenBright';
    case 'create': 
    case 'update': 
    case 'delete': return 'yellow';
    default: return 'gray';
  }
};

export const getLogPrefix = (type: string): string => {
  switch (type) {
    case 'command': return '❯';
    case 'ai': return '✦';
    case 'error': return '✖';
    case 'system': return 'ℹ';
    case 'success': return '✔';
    case 'create': return '+';
    case 'update': return '~';
    case 'delete': return '-';
    default: return '•';
  }
};
