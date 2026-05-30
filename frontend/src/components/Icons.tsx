import React from 'react';

export type IconComponent = React.FC<{ size?: number }>;

interface SVGIconProps {
    children: React.ReactNode;
    size?: number;
}

const Icon: React.FC<SVGIconProps> = (props: SVGIconProps) => {
    const { children, size = 20 } = props;
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {children}
        </svg>
    );
}

export const ChevronLeftIcon = ({ size }: { size?: number }) => (
    <Icon size={size}>
        <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Icon>
);

export const MenuIcon = ({ size }: { size?: number }) => (
    <Icon size={size}>
        <path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
);

export const HomeIcon = ({ size }: { size?: number }) => (
    <Icon size={size}>
        <path d="M3 8.5L10 3l7 5.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.5 18V12.5h5V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
);

export const LedgerIcon = ({ size }: { size?: number }) => (
    <Icon size={size}>
        <rect x="4" y="2.5" width="12" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
);

export const StatsIcon = ({ size }: { size?: number }) => (
    <Icon size={size}>
        <path d="M3 17h2.5v-6H3v6zM8.75 17h2.5V7h-2.5v10zM14.5 17H17V3h-2.5v14z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
);

export const PersonIcon = ({ size }: { size?: number }) => (
    <Icon size={size}>
        <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 18c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
);

export const ChevronDownIcon = ({ size }: { size?: number }) => (
    <Icon size={size}>
        <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
);

export const PlusIcon = ({ size }: { size?: number }) => (
    <Icon size={size}>
        <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Icon>
);