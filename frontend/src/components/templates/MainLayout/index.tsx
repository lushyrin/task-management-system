import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import { Sidebar } from '../../organisms';

const MainLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', flexDirection: 'column' }}>
            {/* Mobile top nav */}
            <div
                className="md:hidden flex items-center gap-3 px-4 sticky top-0 z-30"
                style={{ height: 52, background: '#fafafa', borderBottom: '1px solid #e5e5e5' }}
            >
                <button
                    onClick={() => setMobileOpen(true)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{ border: '1px solid #e5e5e5', background: '#ffffff' }}
                >
                    <MenuOutlined style={{ fontSize: 15, color: '#171717' }} />
                </button>
                <img src="/logo.png" alt="MiniTask" style={{ height: 26, width: 26 }} />
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#171717' }}>MiniTask</span>
            </div>

            <div style={{ display: 'flex', flex: 1 }}>
                <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
                <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
