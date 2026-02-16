import { Outlet } from 'react-router-dom';
import { Navbar } from '../../organisms';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="page-container">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
