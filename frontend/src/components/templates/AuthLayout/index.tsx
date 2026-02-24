import React from 'react';
import { Typography, Card } from 'antd';

const { Title, Text } = Typography;

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex">
            {/* Left*/}
            <div
                className="hidden lg:block relative flex-1"
                style={{
                    background: 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="text-center text-white max-w-lg">
                        <Title level={2} className="!text-white !mb-6">
                            Manage your tasks effortlessly
                        </Title>
                        <Text className="!text-yellow-100 text-lg block mb-8">
                            Organize, track, and collaborate with your team.
                        </Text>

                        <div className="grid grid-cols-2 gap-4">
                            <Card
                                className="border-white/20 backdrop-blur-sm"
                                bodyStyle={{ padding: 16 }}
                                style={{ background: 'rgba(255,255,255,0.15)' }}
                            >
                                <div className="h-16 flex items-center justify-center">
                                    <Text className="!text-white/90 font-medium">placeholder</Text>
                                </div>
                            </Card>
                            <Card
                                className="border-white/20 backdrop-blur-sm"
                                bodyStyle={{ padding: 16 }}
                                style={{ background: 'rgba(255,255,255,0.15)' }}
                            >
                                <div className="h-16 flex items-center justify-center">
                                    <Text className="!text-white/90 font-medium">placeholder</Text>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

                <div className="absolute top-20 left-20 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-48 h-48 bg-yellow-300/30 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl"></div>
            </div>

            {/* Right*/}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-8">
                        <div className="flex items-center gap-3">
                            <div>
                                <img src="/logo.png" alt="MiniTask" style={{ height: '32px', width: 'auto' }} />
                            </div>
                            <Title level={4} className="mb-0! text-gray-900!">
                                MiniTask
                            </Title>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
