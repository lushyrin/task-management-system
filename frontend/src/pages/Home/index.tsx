import { Link } from 'react-router-dom';
import Button from '@/components/atoms/Button'
import { Typography, Space, Card, Row, Col, Tag, Avatar, Tooltip } from 'antd';
import {
    CheckSquareOutlined,
    TeamOutlined,
    BarChartOutlined,
    DragOutlined,
    MessageOutlined,
    HolderOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';

const { Title, Text, Paragraph } = Typography;

const Home = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: <CheckSquareOutlined className="text-3xl text-blue-500" />,
            title: 'Task Management',
            description: 'Create, organize, and track your tasks with ease.',
        },
        {
            icon: <DragOutlined className="text-3xl text-green-500" />,
            title: 'Kanban Board',
            description: 'Visualize your workflow with our intuitive kanban board.',
        },
        {
            icon: <TeamOutlined className="text-3xl text-purple-500" />,
            title: 'Collaboration',
            description: 'Comment on tasks and work together with your team.',
        },
        {
            icon: <BarChartOutlined className="text-3xl text-orange-500" />,
            title: 'Progress Tracking',
            description: 'Monitor your progress with real-time statistics.',
        },
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            <header className='bg-white border-b border-gray-200 sticky top-0 z-50'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex items-center justify-between h-16'>
                        <Link to="/" className='flex items-center gap-2'>
                            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                                {/* logo sementara */}
                                <CheckSquareOutlined className='text-white text-lg'></CheckSquareOutlined>
                            </div>
                            <Text strong className='text-xl text-gray-900'>Minitask</Text>
                        </Link>
                        <div className='flex items-center gap-3'>
                            {isAuthenticated ? (
                                <Link to="/tasks">
                                    <Button variant="primary">
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link to='/login'>
                                        <Button variant='outline' className='rounded-full! px-6 hover:bg-gray-50' >
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to='/register'>
                                        <Button variant='primary' className='rounded-full! px-6 hover:bg-gray-800' >
                                            Register
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="min-h-[calc(100vh-64px)] flex">
                <div className="hidden lg:block flex-1  relative overflow-hidden">
                    {/* blur belakang */}
                    <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
                    {/* Floating Cards Mockup */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="space-y-4 w-full max-w-sm">
                            {/* Done */}
                            <Card className="shadow-lg transform -rotate-3 hover:shadow-xl transition-shadow" bodyStyle={{ padding: 24 }} size="small">
                                <Space direction="vertical" className="w-full" size={8}>
                                    <div className="flex items-start justify-between">
                                        <Tag style={{ color: '#059669', backgroundColor: '#D1FAE5', borderColor: '#D1FAE5', fontWeight: 500, borderRadius: '6px', padding: '2px 10px' }}>
                                            Done
                                        </Tag>
                                        <div className="p-1 hover:bg-gray-100 rounded">
                                            <HolderOutlined className="text-gray-400" />
                                        </div>
                                    </div>
                                    <span className="block text-sm font-semibold leading-snug">Design review done</span>
                                    <span className="block text-xs text-gray-500 line-clamp-2">Completed the final review of the dashboard mockups</span>
                                    <div className="flex items-center justify-between pt-1">
                                        <Space size={8}>
                                            <Tooltip title="Alex"><Avatar size="small" className="bg-green-500 text-xs">A</Avatar></Tooltip>
                                            <Space size={2} className="text-gray-400"><MessageOutlined className="text-xs" /><span className="text-xs text-gray-500">3</span></Space>
                                        </Space>
                                        <span className="text-xs text-gray-500">2h ago</span>
                                    </div>
                                </Space>
                            </Card>

                            {/* inprogress */}
                            <Card className="shadow-lg transform rotate-2 hover:shadow-xl transition-shadow" bodyStyle={{ padding: 24 }} size="small">
                                <Space direction="vertical" className="w-full" size={8}>
                                    <div className="flex items-start justify-between">
                                        <Tag style={{ color: '#2563EB', backgroundColor: '#DBEAFE', borderColor: '#DBEAFE', fontWeight: 500, borderRadius: '6px', padding: '2px 10px' }}>
                                            In Progress
                                        </Tag>
                                        <div className="p-1 hover:bg-gray-100 rounded">
                                            <HolderOutlined className="text-gray-400" />
                                        </div>
                                    </div>
                                    <span className="block text-sm font-semibold leading-snug">API integration</span>
                                    <span className="block text-xs text-gray-500 line-clamp-2">Connect frontend with backend REST APIs</span>
                                    <div className="flex items-center justify-between pt-1">
                                        <Space size={8}>
                                            <Tooltip title="Sarah"><Avatar size="small" className="bg-blue-500 text-xs">S</Avatar></Tooltip>
                                            <Space size={2} className="text-gray-400"><MessageOutlined className="text-xs" /><span className="text-xs text-gray-500">5</span></Space>
                                        </Space>
                                        <span className="text-xs text-gray-500">1d ago</span>
                                    </div>
                                </Space>
                            </Card>

                            {/* blom */}
                            <Card className="shadow-lg transform -rotate-1 hover:shadow-xl transition-shadow" bodyStyle={{ padding: 24 }} size="small">
                                <Space direction="vertical" className="w-full" size={8}>
                                    <div className="flex items-start justify-between">
                                        <Tag style={{ color: '#6B7280', backgroundColor: '#F3F4F6', borderColor: '#F3F4F6', fontWeight: 500, borderRadius: '6px', padding: '2px 10px' }}>
                                            Not Started
                                        </Tag>
                                        <div className="p-1 hover:bg-gray-100 rounded">
                                            <HolderOutlined className="text-gray-400" />
                                        </div>
                                    </div>
                                    <span className="block text-sm font-semibold leading-snug">Team sync meeting</span>
                                    <span className="block text-xs text-gray-500 line-clamp-2">Weekly standup with the development team</span>
                                    <div className="flex items-center justify-between pt-1">
                                        <Space size={8}>
                                            <Tooltip title="Mike"><Avatar size="small" className="bg-purple-500 text-xs">M</Avatar></Tooltip>
                                        </Space>
                                        <span className="text-xs text-gray-500">3d ago</span>
                                    </div>
                                </Space>
                            </Card>
                        </div>
                    </div>
                </div>

                <div className="flex-2 flex flex-col justify-center px-8 lg:px-20 xl:px-32 bg-white">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                {/* logo sementara */}
                                <CheckSquareOutlined className="text-white text-2xl" />
                            </div>
                            <Title level={1} className="mb-0!">
                                MiniTask
                            </Title>
                        </div>

                        <Title level={2} className="text-4xl! md:text-5xl! font-bold! mb-6!">
                            Manage Your Tasks
                            <br />
                            <span className="text-blue-600">Effortlessly</span>
                        </Title>

                        <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            A simple yet powerful task management solution to help you stay organized,
                            track progress, and collaborate with your team.
                        </Paragraph>

                        <Space size="large">
                            {isAuthenticated ? (
                                <Link to="/tasks">
                                    <Button variant="primary" size="lg">
                                        Go to Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register">
                                        <Button variant="primary" size="lg">
                                            Get Started Free
                                        </Button>
                                    </Link>
                                    <Link to="/login">
                                        <Button size="lg">Sign In</Button>
                                    </Link>
                                </>
                            )}
                        </Space>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <Title level={3}>Features</Title>
                    <Text type="secondary" className="text-lg">
                        Everything you need to manage your tasks
                    </Text>
                </div>

                <Row gutter={[24, 24]}>
                    {features.map((feature, index) => (
                        <Col xs={24} sm={12} lg={6} key={index}>
                            <Card
                                className="h-full text-center hover:shadow-lg transition-shadow"
                                bodyStyle={{ padding: 24 }}
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <Title level={5}>{feature.title}</Title>
                                <Text type="secondary">{feature.description}</Text>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-blue-600 rounded-2xl p-12 text-center">
                    <Title level={3} className="text-white! mb-4!">
                        Ready to get started?
                    </Title>
                    <Text className="text-blue-100! text-lg block mb-6">
                        Join thousands of users who trust MiniTask for their task management.
                    </Text>
                    {!isAuthenticated && (
                        <Link to="/register">
                            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                                Create Free Account
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <footer className="border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <Space>
                            <Link to="#" className="text-gray-500 hover:text-gray-700">
                                Privacy Policy
                            </Link>
                            <Link to="#" className="text-gray-500 hover:text-gray-700">
                                Terms of Service
                            </Link>
                        </Space>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
