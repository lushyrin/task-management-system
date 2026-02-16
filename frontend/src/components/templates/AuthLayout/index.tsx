import React from 'react';
import { Typography, Card } from 'antd';
import { CheckSquareOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:block relative flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="text-center text-white max-w-lg">
                        <Title level={2} className="!text-white !mb-6">
                            Manage your tasks effortlessly
                        </Title>
                        <Text className="!text-blue-100 text-lg block mb-8">
                            Organize, track, and collaborate with your team.
                        </Text>

                        <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-white/10 border-white/20 backdrop-blur-sm" bodyStyle={{ padding: 16 }}>
                                <div className="h-16 flex items-center justify-center">
                                    <Text className="!text-white/80">Tasks</Text>
                                </div>
                            </Card>
                            <Card className="bg-white/10 border-white/20 backdrop-blur-sm" bodyStyle={{ padding: 16 }}>
                                <div className="h-16 flex items-center justify-center">
                                    <Text className="!text-white/80">Teams</Text>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <CheckSquareOutlined className="text-white text-xl" />
                            </div>
                            <Title level={4} className="!mb-0 !text-gray-900">
                                MiniTask
                            </Title>
                        </div>
                    </div>

                    {/* Content */}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
