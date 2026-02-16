import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Typography } from 'antd';
import {
    CheckSquareOutlined,
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
        <Header className="bg-white border-b border-gray-200 px-0 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/tasks" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <CheckSquareOutlined className="text-white text-lg" />
                        </div>
                        <Text strong className="text-xl text-gray-900 hidden sm:block">
                            MiniTask
                        </Text>
                    </Link>

                    {/* Navigation Menu - Desktop */}
                    {isAuthenticated && (
                        <Menu
                            mode="horizontal"
                            selectedKeys={[selectedKey]}
                            items={menuItems}
                            className="hidden md:flex flex-1 justify-center border-0 min-w-0"
                        />
                    )}

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <Dropdown
                                menu={{ items: userMenuItems }}
                                placement="bottomRight"
                                arrow
                            >
                                <Button type="text" className="flex items-center gap-2 hover:bg-gray-100">
                                    <Avatar
                                        size="small"
                                        icon={<UserOutlined />}
                                        className="bg-blue-500"
                                    >
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Text className="hidden sm:block max-w-[100px] truncate">
                                        {user?.username}
                                    </Text>
                                    <DownOutlined className="text-xs text-gray-400" />
                                </Button>
                            </Dropdown>
                        ) : (
                            <div className="flex gap-2">
                                <Button type="text" onClick={() => navigate('/login')}>
                                    Sign In
                                </Button>
                                <Button type="primary" onClick={() => navigate('/register')}>
                                    Get Started
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Bottom Navigation */}
            {isAuthenticated && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                    <Menu
                        mode="horizontal"
                        selectedKeys={[selectedKey]}
                        items={menuItems}
                        className="flex justify-around border-0"
                    />
                </div>
            )}
        </Header>
    );
};

export default Navbar;
