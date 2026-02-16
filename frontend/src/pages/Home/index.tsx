import { Link } from 'react-router-dom';
import { Button, Typography, Space, Card, Row, Col } from 'antd';
import {
    CheckSquareOutlined,
    TeamOutlined,
    BarChartOutlined,
    DragOutlined,
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <CheckSquareOutlined className="text-white text-2xl" />
                        </div>
                        <Title level={1} className="!mb-0">
                            MiniTask
                        </Title>
                    </div>

                    <Title level={2} className="!text-4xl md:!text-5xl !font-bold !mb-6">
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
                                <Button type="primary" size="large">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/register">
                                    <Button type="primary" size="large">
                                        Get Started Free
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button size="large">Sign In</Button>
                                </Link>
                            </>
                        )}
                    </Space>
                </div>
            </div>

            {/* Features Section */}
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

            {/* CTA Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-blue-600 rounded-2xl p-12 text-center">
                    <Title level={3} className="!text-white !mb-4">
                        Ready to get started?
                    </Title>
                    <Text className="!text-blue-100 text-lg block mb-6">
                        Join thousands of users who trust MiniTask for their task management.
                    </Text>
                    {!isAuthenticated && (
                        <Link to="/register">
                            <Button type="default" size="large" className="bg-white text-blue-600 hover:bg-gray-100">
                                Create Free Account
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Footer */}
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
