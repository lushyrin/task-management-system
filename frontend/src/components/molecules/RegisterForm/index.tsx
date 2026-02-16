import React from 'react';
import { Form, Input, Button, Checkbox, Divider, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined, AppleFilled } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

export interface RegisterFormProps {
    onSubmit: (data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
        agreeToTerms: boolean;
    }) => void;
    onSignIn: () => void;
    loading?: boolean;
    error?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
    onSubmit,
    onSignIn,
    loading = false,
    error,
}) => {
    const [form] = Form.useForm();

    const handleSubmit = (values: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
        agreeToTerms: boolean;
    }) => {
        onSubmit(values);
    };

    const handleSocialSignUp = (provider: 'google' | 'apple') => {
        console.log(`Sign up with ${provider}`);
    };

    return (
        <div className="w-full max-w-md">
            <div className="mb-8">
                <Title level={2} className="!mb-2">
                    Create Account
                </Title>
                <Text type="secondary">
                    Sign up to get started with your new account.
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
            >
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'First name is required' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="John"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Last name is required' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Doe"
                            size="large"
                        />
                    </Form.Item>
                </div>

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
                        { min: 8, message: 'Password must be at least 8 characters' },
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
                        I agree to the Terms of Service and Privacy Policy
                    </Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={loading}
                    >
                        Create Account
                    </Button>
                </Form.Item>

                <Divider>
                    <Text type="secondary" className="text-xs">
                        Or Sign Up With
                    </Text>
                </Divider>

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        block
                        size="large"
                        icon={<GoogleOutlined />}
                        onClick={() => handleSocialSignUp('google')}
                        disabled={loading}
                    >
                        Google
                    </Button>
                    <Button
                        block
                        size="large"
                        icon={<AppleFilled />}
                        onClick={() => handleSocialSignUp('apple')}
                        disabled={loading}
                    >
                        Apple
                    </Button>
                </div>

                <div className="text-center mt-6">
                    <Text type="secondary">
                        Already Have An Account?{' '}
                        <Link onClick={onSignIn}>Sign In.</Link>
                    </Text>
                </div>
            </Form>
        </div>
    );
};

export default RegisterForm;
