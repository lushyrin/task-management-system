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
            icon: <CheckSquareOutlined className="text-3xl" style={{ color: '#eab308' }} />,
            title: 'Task Management',
            description: 'Create, organize, and track your tasks with ease.',
        },
        {
            icon: <DragOutlined className="text-3xl" style={{ color: '#22c55e' }} />,
            title: 'Kanban Board',
            description: 'Visualize your workflow with our intuitive kanban board.',
        },
        {
            icon: <TeamOutlined className="text-3xl" style={{ color: '#a855f7' }} />,
            title: 'Collaboration',
            description: 'Comment on tasks and work together with your team.',
        },
        {
            icon: <BarChartOutlined className="text-3xl" style={{ color: '#f97316' }} />,
            title: 'Progress Tracking',
            description: 'Monitor your progress with real-time statistics.',
        },
    ];

    return (
        <div className="min-h-screen" style={{ background: '#fafafa' }}>
            <header
                className='sticky top-0 z-50'
                style={{ background: 'rgba(255,255,255,0.9)', borderBottom: '1px solid #e5e5e5', backdropFilter: 'blur(10px)' }}>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex items-center justify-between h-16'>
                        <Link to="/" className='flex items-center gap-2'>
                            <img src="/logo.png" alt="MiniTask" style={{ height: '32px', width: 'auto' }} />
                            <Text strong className='text-xl' style={{ color: '#171717' }}>Minitask</Text>
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
                                        <Button variant='outline' className='px-6 hover:bg-gray-50 rounded-full'>
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to='/register'>
                                        <Button variant='primary' className='px-6 rounded-full bg-neutral-900 border-neutral-900'>
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
                <div className="hidden lg:block flex-1 relative overflow-hidden bg-white" >

                    <div
                        className="absolute top-16 right-16 w-16 h-16 rounded shadow-lg transform rotate-12"
                        style={{ background: '#fef08a', animation: 'float 3s ease-in-out infinite' } as React.CSSProperties}
                    ></div>
                    <div
                        className="absolute bottom-20 left-12 w-12 h-12 rounded shadow-md transform -rotate-6"
                        style={{ background: '#fbcfe8', animation: 'float 4s ease-in-out infinite 0.5s' } as React.CSSProperties}
                    ></div>
                    <div
                        className="absolute top-14 right-8 w-10 h-10 rounded shadow-sm transform rotate-3"
                        style={{ background: '#fed7aa', animation: 'float 3.5s ease-in-out infinite 1s' } as React.CSSProperties}
                    ></div>

                    <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="space-y-4 w-full max-w-sm">
                            <Card
                                className="transform -rotate-3 hover:shadow-xl transition-shadow"
                                bodyStyle={{ padding: 20 }}
                                size="small"
                                style={{
                                    background: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }}
                            >
                                <Space direction="vertical" className="w-full" size={8}>
                                    <div className="flex items-start justify-between">
                                        <Tag style={{
                                            color: '#15803d',
                                            backgroundColor: 'rgba(34,197,94,0.2)',
                                            borderColor: 'transparent',
                                            fontWeight: 600,
                                            borderRadius: '6px',
                                            padding: '2px 10px',
                                            fontSize: '11px',
                                        }}>
                                            Done
                                        </Tag>
                                        <div className="p-1 hover:bg-black/5 rounded">
                                            <HolderOutlined className="text-gray-400" />
                                        </div>
                                    </div>
                                    <span className="block text-sm font-semibold leading-snug" style={{ color: '#171717' }}>Design review complete</span>
                                    <span className="block text-xs line-clamp-2" style={{ color: '#525252' }}>Completed the final review of the dashboard mockups</span>
                                    <div className="flex items-center justify-between pt-1">
                                        <Space size={8}>
                                            <Tooltip title="Alex">
                                                <Avatar
                                                    size="small"
                                                    style={{ background: '#facc15', color: '#713f12', fontSize: '11px' }}
                                                >A</Avatar>
                                            </Tooltip>
                                            <Space size={2} style={{ color: '#737373' }}>
                                                <MessageOutlined className="text-xs" />
                                                <span className="text-xs">3</span>
                                            </Space>
                                        </Space>
                                        <span className="text-xs" style={{ color: '#a3a3a3' }}>2h ago</span>
                                    </div>
                                </Space>
                            </Card>

                            <Card
                                className="transform rotate-2 hover:shadow-xl transition-shadow"
                                bodyStyle={{ padding: 20 }}
                                size="small"
                                style={{
                                    background: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }}
                            >
                                <Space direction="vertical" className="w-full" size={8}>
                                    <div className="flex items-start justify-between">
                                        <Tag style={{
                                            color: '#a16207',
                                            backgroundColor: 'rgba(234,179,8,0.2)',
                                            borderColor: 'transparent',
                                            fontWeight: 600,
                                            borderRadius: '6px',
                                            padding: '2px 10px',
                                            fontSize: '11px',
                                        }}>
                                            In Progress
                                        </Tag>
                                        <div className="p-1 hover:bg-black/5 rounded">
                                            <HolderOutlined className="text-gray-400" />
                                        </div>
                                    </div>
                                    <span className="block text-sm font-semibold leading-snug" style={{ color: '#171717' }}>API integration</span>
                                    <span className="block text-xs line-clamp-2" style={{ color: '#525252' }}>Connect frontend with backend REST APIs</span>
                                    <div className="flex items-center justify-between pt-1">
                                        <Space size={8}>
                                            <Tooltip title="Sarah">
                                                <Avatar
                                                    size="small"
                                                    style={{ background: '#eab308', color: '#713f12', fontSize: '11px' }}
                                                >S</Avatar>
                                            </Tooltip>
                                            <Space size={2} style={{ color: '#737373' }}>
                                                <MessageOutlined className="text-xs" />
                                                <span className="text-xs">5</span>
                                            </Space>
                                        </Space>
                                        <span className="text-xs" style={{ color: '#a3a3a3' }}>1d ago</span>
                                    </div>
                                </Space>
                            </Card>

                            <Card
                                className="transform -rotate-1 hover:shadow-xl transition-shadow"
                                bodyStyle={{ padding: 20 }}
                                size="small"
                                style={{
                                    background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }}
                            >
                                <Space direction="vertical" className="w-full" size={8}>
                                    <div className="flex items-start justify-between">
                                        <Tag style={{
                                            color: '#525252',
                                            backgroundColor: 'rgba(0,0,0,0.08)',
                                            borderColor: 'transparent',
                                            fontWeight: 600,
                                            borderRadius: '6px',
                                            padding: '2px 10px',
                                            fontSize: '11px',
                                        }}>
                                            Not Started
                                        </Tag>
                                        <div className="p-1 hover:bg-black/5 rounded">
                                            <HolderOutlined className="text-gray-400" />
                                        </div>
                                    </div>
                                    <span className="block text-sm font-semibold leading-snug" style={{ color: '#171717' }}>Team sync meeting</span>
                                    <span className="block text-xs line-clamp-2" style={{ color: '#525252' }}>Weekly standup with the development team</span>
                                    <div className="flex items-center justify-between pt-1">
                                        <Space size={8}>
                                            <Tooltip title="Mike">
                                                <Avatar
                                                    size="small"
                                                    style={{ background: '#a855f7', color: '#fff', fontSize: '11px' }}
                                                >M</Avatar>
                                            </Tooltip>
                                        </Space>
                                        <span className="text-xs" style={{ color: '#a3a3a3' }}>3d ago</span>
                                    </div>
                                </Space>
                            </Card>
                        </div>
                    </div>
                </div>

                <div className="flex-2 flex flex-col justify-center px-8 lg:px-20 xl:px-32 bg-white relative overflow-hidden">

                    <div className="text-center relative z-10">

                        <div className="flex items-center justify-center gap-3 mb-6">
                            <img src="/logo.png" alt="MiniTask" style={{ height: '32px', width: 'auto' }} />
                            <Title level={1} style={{ fontSize: '2.5rem', marginBottom: 0 }}>
                                MiniTask
                            </Title>
                        </div>

                        <Title
                            level={2}
                            className="text-4xl md:text-5xl font-bold mb-6"
                            style={{ letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '1.5rem' }}
                        >
                            Manage Your Tasks
                            <br />
                            <span style={{
                                background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>Effortlessly</span>
                        </Title>

                        <Paragraph
                            className="text-xl max-w-2xl mx-auto mb-8"
                            style={{ color: '#525252', lineHeight: 1.6 }}
                        >
                            A simple yet powerful task management solution to help you stay organized,
                            track progress, and collaborate with your team.
                        </Paragraph>

                        <div className="flex justify-center gap-4 mb-8 flex-wrap">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: '#f5f5f5' }}>
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-sm font-medium" style={{ color: '#525252' }}>Kanban Board</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: '#f5f5f5' }}>
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <span className="text-sm font-medium" style={{ color: '#525252' }}>Team Collaboration</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: '#f5f5f5' }}>
                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                <span className="text-sm font-medium" style={{ color: '#525252' }}>Progress Tracking</span>
                            </div>
                        </div>

                        <Space size="large">
                            {isAuthenticated ? (
                                <Link to="/tasks">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="bg-neutral-900 border-neutral-900 shadow-lg"
                                    >
                                        Go to Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register">
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="bg-neutral-900 border-neutral-900 shadow-lg"
                                        >
                                            Get Started Free
                                        </Button>
                                    </Link>
                                    <Link to="/login">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="border-neutral-200 text-neutral-600"
                                        >
                                            Sign In
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </Space>

                        <div className="mt-10 pt-8 border-t" style={{ borderColor: '#e5e5e5' }}>
                            <p className="text-sm mb-4" style={{ color: '#a3a3a3' }}>
                                Trusted by teams worldwide
                            </p>
                            <div className="flex justify-center gap-8 opacity-50">
                                <div className="text-lg font-bold" style={{ color: '#737373' }}>###</div>
                                <div className="text-lg font-bold" style={{ color: '#737373' }}>####</div>
                                <div className="text-lg font-bold" style={{ color: '#737373' }}>#####</div>
                                <div className="text-lg font-bold" style={{ color: '#737373' }}>######</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-12">
                        <Title level={3}>Features</Title>
                        <Text type="secondary" className="text-lg">
                            Everything you need to manage your tasks
                        </Text>
                    </div>

                    <Row gutter={[24, 24]}>
                        {features.map((feature: any, index: number) => (
                            <Col xs={24} sm={12} lg={6} key={index}>
                                <Card
                                    className="h-full text-center hover:shadow-lg transition-shadow"
                                    styles={{ body: { padding: 24 } }}
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
                    <div
                        className="rounded-2xl p-12 text-center"
                        style={{ background: '#facc15' }}
                    >
                        <Title level={3} style={{ color: '#713f12', marginBottom: '1rem' }}>
                            Ready to get started?
                        </Title>
                        <Text style={{ color: '#854d0e', fontSize: '1.125rem', display: 'block', marginBottom: '1.5rem' }}>
                            Join thousands of users who trust MiniTask for their task management.
                        </Text>
                        {isAuthenticated === false && (
                            <Link to="/register">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="bg-white text-yellow-900 border-white"
                                >
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
            </>
        </div>
    );
};

export default Home;
