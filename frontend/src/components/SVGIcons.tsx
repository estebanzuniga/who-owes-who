import React from 'react';

interface SVGIconProps {
    children: React.ReactNode;
    className?: string;
    size?: number;
}

const SVGIcon = (props: SVGIconProps) => {
    const { children, className = '', size = 20 } = props;
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            {children}
        </svg>
    );
}

export const ChevronLeftIcon = ({ size }: { size?: number }) => (
    <SVGIcon size={size}>
        <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </SVGIcon>
);