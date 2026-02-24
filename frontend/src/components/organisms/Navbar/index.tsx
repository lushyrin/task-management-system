import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Typography } from 'antd';
import {
    ProjectOutlined,
    ColumnHeightOutlined,
    LogoutOutlined,
    UserOutlined,
    DownOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();

    const menuItems = [
        {
            key: '/tasks',
            icon: <ProjectOutlined />,
            label: <Link to="/tasks">Tasks</Link>,
        },
        {
            key: '/kanban',
            icon: <ColumnHeightOutlined />,
            label: <Link to="/kanban">Kanban</Link>,
        },
    ];

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
            disabled: true,
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
            onClick: logout,
        },
    ];

    const selectedKey = menuItems.find(item => location.pathname.startsWith(item.key))?.key || '';

    return (
        <Header
            style={{
                background: '#fff',
                borderBottom: '1px solid #e5e5e5',
                padding: 0,
                position: 'sticky',
                top: 0,
                zIndex: 50,
                height: 56,
                lineHeight: '56px',
            }}
        >
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100%',
                }}
            >
                {/* Logo */}
                <Link to="/tasks" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div>
                        <img src="/logo.png" alt="MiniTask" style={{ height: '32px', width: 'auto' }} />
                    </div>
                    <Text
                        strong
                        style={{
                            fontSize: '1.125rem',
                            color: '#171717',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        MiniTask
                    </Text>
                </Link>

                {/* Navigation Menu - Desktop */}
                {isAuthenticated && (
                    <Menu
                        mode="horizontal"
                        selectedKeys={[selectedKey]}
                        items={menuItems}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            border: 'none',
                            background: 'transparent',
                            minWidth: 0,
                        }}
                    />
                )}

                {/* Right Side Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {isAuthenticated ? (
                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="bottomRight"
                            arrow
                        >
                            <Button
                                type="text"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    height: 36,
                                    padding: '0 8px',
                                    borderRadius: '6px',
                                }}
                            >
                                <Avatar
                                    size="small"
                                    style={{
                                        background: '#fef08a',
                                        color: '#713f12',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                    }}
                                >
                                    {user?.username?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Text
                                    style={{
                                        maxWidth: '100px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        color: '#525252',
                                        fontSize: '14px',
                                    }}
                                >
                                    {user?.username}
                                </Text>
                                <DownOutlined style={{ fontSize: '10px', color: '#a3a3a3' }} />
                            </Button>
                        </Dropdown>
                    ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button
                                type="text"
                                onClick={() => navigate('/login')}
                                style={{
                                    color: '#525252',
                                    fontWeight: 500,
                                }}
                            >
                                Sign In
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => navigate('/register')}
                                style={{
                                    background: '#171717',
                                    borderRadius: '6px',
                                    fontWeight: 500,
                                }}
                            >
                                Get Started
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu - Bottom Navigation */}
            {isAuthenticated && (
                <div
                    style={{
                        display: 'none',
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: '#fff',
                        borderTop: '1px solid #e5e5e5',
                        zIndex: 50,
                    }}
                    className="mobile-nav"
                >
                    <Menu
                        mode="horizontal"
                        selectedKeys={[selectedKey]}
                        items={menuItems}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            border: 'none',
                            height: '56px',
                        }}
                    />
                </div>
            )}
        </Header>
    );
};

export default Navbar;
