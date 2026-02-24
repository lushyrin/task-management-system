import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuthContext } from '@/context/AuthContext';

const { Title, Text, Link } = Typography;

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

const Register = () => {
    const navigate = useNavigate();
    const { register, isAuthenticated } = useAuthContext();
    const [form] = Form.useForm();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/tasks', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (values: RegisterFormData) => {
        try {
            await register.mutateAsync({
                username: values.username,
                email: values.email,
                password: values.password,
            });
            navigate('/tasks', { replace: true });
        } catch (error) {
            // Error is handled by the mutation
        }
    };


    return (
        <>
            <div className="mb-8">
                <Title level={2} className="mb-2!">
                    Create Account
                </Title>
                <Text type="secondary">
                    Sign up to get started with your new account.
                </Text>
            </div>

            {register.isError && (
                <Alert
                    message="Registration Failed"
                    description={register.error?.message || "An error occurred during registration. Please try again."}
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
            >
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        { required: true, message: 'Please enter your username' },
                        { min: 3, message: 'Username must be at least 3 characters' },
                        { max: 30, message: 'Username must be less than 30 characters' },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined className="text-gray-400" />}
                        placeholder="Enter your username"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' },
                    ]}
                >
                    <Input
                        prefix={<MailOutlined className="text-gray-400" />}
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
                        placeholder="Create a password"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Please confirm your password' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Confirm your password"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="agreeToTerms"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value
                                    ? Promise.resolve()
                                    : Promise.reject(new Error('You must agree to the terms')),
                        },
                    ]}
                >
                    <Checkbox>
                        I agree to the <Link>Terms of Service</Link> and{' '}
                        <Link>Privacy Policy</Link>
                    </Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={register.isPending}
                    >
                        Create Account
                    </Button>
                </Form.Item>
            </Form>

            <div className="mt-6 text-center">
                <Text type="secondary">
                    Already have an account?{' '}
                    <Link onClick={() => navigate('/login')}>Sign in</Link>
                </Text>
            </div>
        </>
    );
};

export default Register;
