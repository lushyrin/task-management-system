import { Tag } from 'antd';

type Priority = 'low' | 'medium' | 'high';

interface PriorityBadgeProps {
    priority: Priority;
}

const priorityConfig: Record<Priority, { color: string; label: string; bgColor: string }> = {
    low: {
        color: '#059669',
        label: 'Low',
        bgColor: '#D1FAE5',
    },
    medium: {
        color: '#D97706',
        label: 'Medium',
        bgColor: '#FEF3C7',
    },
    high: {
        color: '#DC2626',
        label: 'High',
        bgColor: '#FEE2E2',
    },
};

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
    const config = priorityConfig[priority];

    return (
        <Tag
            style={{
                color: config.color,
                backgroundColor: config.bgColor,
                borderColor: config.bgColor,
                fontWeight: 500,
                borderRadius: '6px',
                padding: '2px 10px',
                fontSize: '12px',
            }}
        >
            {config.label}
        </Tag>
    );
};

export default PriorityBadge;
