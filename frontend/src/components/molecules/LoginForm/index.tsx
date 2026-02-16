import React from 'react';
import { Form, Input, Button, Checkbox, Divider, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, AppleFilled } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

interface LoginFormProps {
    onSubmit: (data: { email: string; password: string; rememberMe: boolean }) => void;
    onForgotPassword: () => void;
    onSignUp: () => void;
    loading?: boolean;
    error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
    onSubmit,
    onForgotPassword,
    onSignUp,
    loading = false,
    error,
}) => {
    const [form] = Form.useForm();

    const handleSubmit = (values: { email: string; password: string; remember: boolean }) => {
        onSubmit({
            email: values.email,
            password: values.password,
            rememberMe: values.remember,
        });
    };

    const handleSocialLogin = (provider: 'google' | 'apple') => {
        console.log(`Login with ${provider}`);
    };

    return (
        <div className="w-full max-w-md">
            <div className="mb-8">
                <Title level={2} className="!mb-2">
                    Welcome Back
                </Title>
                <Text type="secondary">
                    Enter your email and password to access your account.
                </Text>
            </div>

            {error && (
                <Alert
                    message={error}
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
                initialValues={{ remember: false }}
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
                    <Form.Item name="remember" valuePropName="checked" className="!mb-0">
                        <Checkbox>Remember Me</Checkbox>
                    </Form.Item>
                    <Link onClick={onForgotPassword}>Forgot Your Password?</Link>
                </div>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={loading}
                    >
                        Log In
                    </Button>
                </Form.Item>

                <Divider>
                    <Text type="secondary" className="text-xs">
                        Or Login With
                    </Text>
                </Divider>

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        block
                        size="large"
                        icon={<GoogleOutlined />}
                        onClick={() => handleSocialLogin('google')}
                        disabled={loading}
                    >
                        Google
                    </Button>
                    <Button
                        block
                        size="large"
                        icon={<AppleFilled />}
                        onClick={() => handleSocialLogin('apple')}
                        disabled={loading}
                    >
                        Apple
                    </Button>
                </div>

                <div className="text-center mt-6">
                    <Text type="secondary">
                        Don't Have An Account?{' '}
                        <Link onClick={onSignUp}>Register Now.</Link>
                    </Text>
                </div>
            </Form>
        </div>
    );
};

export default LoginForm;
