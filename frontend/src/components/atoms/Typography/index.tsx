import React, { type JSX } from 'react';

export interface TypographyProps {
    children: React.ReactNode;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'link';
    component?: keyof JSX.IntrinsicElements;
    className?: string;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'inherit';
    align?: 'left' | 'center' | 'right';
    href?: string;
    onClick?: () => void;
}

const Typography: React.FC<TypographyProps> = ({
    children,
    variant = 'body1',
    component,
    className = '',
    color = 'inherit',
    align = 'left',
    href,
    onClick,
}) => {
    const variantClasses = {
        h1: 'text-4xl font-bold',
        h2: 'text-3xl font-bold',
        h3: 'text-2xl font-semibold',
        h4: 'text-xl font-semibold',
        h5: 'text-lg font-medium',
        h6: 'text-base font-medium',
        body1: 'text-base',
        body2: 'text-sm',
        caption: 'text-xs',
        link: 'text-sm text-blue-600 hover:text-blue-800 cursor-pointer',
    };

    const colorClasses = {
        primary: 'text-blue-600',
        secondary: 'text-gray-600',
        error: 'text-red-600',
        warning: 'text-yellow-600',
        success: 'text-green-600',
        inherit: '',
    };

    const alignClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    };

    const defaultComponent = {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        h6: 'h6',
        body1: 'p',
        body2: 'p',
        caption: 'span',
        link: href ? 'a' : 'span',
    };

    const Component = component || defaultComponent[variant] as keyof JSX.IntrinsicElements;
    const classes = `${variantClasses[variant]} ${colorClasses[color]} ${alignClasses[align]} ${className}`.trim();

    const props: any = {
        className: classes,
    };

    if (href) {
        props.href = href;
        props.target = '_blank';
        props.rel = 'noopener noreferrer';
    }

    if (onClick) {
        props.onClick = onClick;
    }

    return React.createElement(Component, props, children);
};

export default Typography;
