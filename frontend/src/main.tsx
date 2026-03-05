import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import { queryClient } from './config/queryClient';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element not found');
}

createRoot(rootElement).render(
    <StrictMode>
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#3B82F6',
                    colorSuccess: '#10B981',
                    colorWarning: '#F59E0B',
                    colorError: '#EF4444',
                    colorInfo: '#3B82F6',
                    borderRadius: 8,
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
                },
            }}
        >
            <QueryClientProvider client={queryClient}>
                <App />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ConfigProvider>
    </StrictMode>
);