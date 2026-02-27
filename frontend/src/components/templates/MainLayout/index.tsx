import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../organisms';

const MainLayout = () => {
    return (
        <div 
            style={{
                minHeight: '100vh',
                background: '#fafafa',
                display: 'flex',
            }}
        >
            <Sidebar />
            <main 
                style={{
                    flex: 1,
                    padding: '24px',
                    overflow: 'auto',
                }}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
