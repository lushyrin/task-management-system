import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { AuthLayout, MainLayout } from '../components/templates';
import { useAuth } from '../hooks/useAuth';

// Lazy load pages for better performance
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Tasks = lazy(() => import('../pages/Tasks'));
const TaskDetail = lazy(() => import('../pages/TaskDetail'));
const Kanban = lazy(() => import('../pages/Kanban'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Fast loading spinner component
const FastSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
        <Spin indicator={<LoadingOutlined spin className="text-2xl text-blue-600" />} />
    </div>
);

// Protected Route wrapper component
const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // Quick loading check - if we have localStorage data, don't show loading
    const hasLocalAuth = !!localStorage.getItem('token');

    if (isLoading && !hasLocalAuth) {
        return <FastSpinner />;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Public Route wrapper - redirects to tasks if already authenticated
const PublicRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // Quick loading check
    const hasLocalAuth = !!localStorage.getItem('token');

    if (isLoading && !hasLocalAuth) {
        return <FastSpinner />;
    }

    return !isAuthenticated ? <Outlet /> : <Navigate to="/tasks" replace />;
};

// Wrapper for lazy loaded components
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<FastSpinner />}>
        {children}
    </Suspense>
);

export const routes = createBrowserRouter([
    // Public routes (unauthenticated users only)
    {
        element: <PublicRoute />,
        children: [
            {
                path: '/',
                element: (
                    <PageWrapper>
                        <Home />
                    </PageWrapper>
                ),
            },
            {
                path: '/login',
                element: (
                    <AuthLayout>
                        <PageWrapper>
                            <Login />
                        </PageWrapper>
                    </AuthLayout>
                ),
            },
            {
                path: '/register',
                element: (
                    <AuthLayout>
                        <PageWrapper>
                            <Register />
                        </PageWrapper>
                    </AuthLayout>
                ),
            },
        ],
    },
    // Protected routes (authenticated users only)
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: '/tasks',
                        element: (
                            <PageWrapper>
                                <Tasks />
                            </PageWrapper>
                        ),
                    },
                    {
                        path: '/tasks/:id',
                        element: (
                            <PageWrapper>
                                <TaskDetail />
                            </PageWrapper>
                        ),
                    },
                    {
                        path: '/kanban',
                        element: (
                            <PageWrapper>
                                <Kanban />
                            </PageWrapper>
                        ),
                    },
                    {
                        path: '/dashboard',
                        element: <Navigate to="/tasks" replace />,
                    },
                ],
            },
        ],
    },
    // Catch all route
    {
        path: '*',
        element: (
            <PageWrapper>
                <NotFound />
            </PageWrapper>
        ),
    },
]);

export default routes;
