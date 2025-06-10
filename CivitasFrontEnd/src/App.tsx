import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; 
import '@mantine/notifications/styles.css'; 

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';
import { Notifications } from '@mantine/notifications';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications />
        <Router />
      </MantineProvider>
    </QueryClientProvider>
  );
}