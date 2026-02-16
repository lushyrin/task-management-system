import { RouterProvider } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { QueryClientProvider } from '@tanstack/react-query';
import routes from './config/routes';
import queryClient from './config/queryClient';
import './index.css';
import { AuthProvider } from '@/context/AuthContext';

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AntdApp>
                    <RouterProvider router={routes} />
                </AntdApp>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
