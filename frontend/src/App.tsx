import { RouterProvider } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import routes from './config/routes';
import './index.css';
import { AuthProvider } from '@/context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <AntdApp>
                <RouterProvider router={routes} />
            </AntdApp>
        </AuthProvider>
    );
}

export default App;
