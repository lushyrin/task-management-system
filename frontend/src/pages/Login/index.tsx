import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Divider, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, AppleFilled } from '@ant-design/icons';
import { useAuthContext } from '@/context/AuthContext';
const { Title, Text, Link } = Typography;

interface LoginFormData {
    email: string;
    password: string;
    remember: boolean;
}

const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuthContext();
    const [form] = Form.useForm();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/tasks', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (values: LoginFormData) => {
        try {
            await login.mutateAsync({
                email: values.email,
                password: values.password,
            });
            navigate('/tasks', { replace: true });
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleSocialLogin = (provider: 'google' | 'apple') => {
        console.log(`Login with ${provider}`);
    };

    return (
        <>
            <div className="mb-8">
                <Title level={2} className="mb-2!">
                    Welcome Back
                </Title>
                <Text type="secondary">
                    Enter your email and password to access your account.
                </Text>
            </div>

            {login.isError && (
                <Alert
                    message="Login Failed"
                    description="Invalid email or password. Please try again."
                    type="error"
                    showIcon
                    className="mb-6"
                    closable
                />
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ remember: true }}
            >
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined className="text-gray-400" />}
                        placeholder="Enter your email"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        { required: true, message: 'Please enter your password' },
                        { min: 6, message: 'Password must be at least 6 characters' },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Enter your password"
                        size="large"
                    />
                </Form.Item>

                <div className="flex items-center justify-between mb-6">
                    <Form.Item name="remember" valuePropName="checked" className="mb-0!">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <Link onClick={() => navigate('/forgot-password')}>
                        Forgot password?
                    </Link>
                </div>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={login.isPending}
                    >
                        Sign In
                    </Button>
                </Form.Item>
            </Form>

            <Divider>
                <Text type="secondary" className="text-xs">
                    Or continue with
                </Text>
            </Divider>

            <Space className="w-full" size="middle">
                <Button
                    block
                    size="large"
                    icon={<GoogleOutlined />}
                    onClick={() => handleSocialLogin('google')}
                >
                    Google
                </Button>
                <Button
                    block
                    size="large"
                    icon={<AppleFilled />}
                    onClick={() => handleSocialLogin('apple')}
                >
                    Apple
                </Button>
            </Space>

            <div className="mt-6 text-center">
                <Text type="secondary">
                    Don't have an account?{' '}
                    <Link onClick={() => navigate('/register')}>Sign up</Link>
                </Text>
            </div>
        </>
    );
};

export default Login;
