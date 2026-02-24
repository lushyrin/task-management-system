import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div 
            className="min-h-screen flex items-center justify-center"
            style={{ background: '#fafafa' }}
        >
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4" style={{ color: '#171717' }}>404</h1>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: '#525252' }}>Page Not Found</h2>
                <p className="text-lg mb-8" style={{ color: '#737373' }}>
                    The page you are looking for does not exist.
                </p>
                <Link
                    to="/"
                    className="inline-block text-white px-6 py-3 rounded-lg transition duration-200"
                    style={{ background: '#171717' }}
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
