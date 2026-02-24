import { Outlet } from 'react-router-dom';
import { Navbar } from '../../organisms';

const MainLayout = () => {
    return (
        <div 
            style={{
                minHeight: '100vh',
                background: '#fafafa',
            }}
        >
            <Navbar />
            <main 
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '24px',
                }}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
