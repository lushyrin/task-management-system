import { Tag } from 'antd';
import { type TaskStatus } from '@/types';

interface StatusBadgeProps {
    status: TaskStatus;
}

const statusConfig: Record<TaskStatus, { color: string; label: string; bgColor: string }> = {
    not_started: {
        color: '#6B7280',
        label: 'Not Started',
        bgColor: '#F3F4F6',
    },
    in_progress: {
        color: '#2563EB',
        label: 'In Progress',
        bgColor: '#DBEAFE',
    },
    done: {
        color: '#059669',
        label: 'Done',
        bgColor: '#D1FAE5',
    },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const config = statusConfig[status];

    return (
        <Tag
            style={{
                color: config.color,
                backgroundColor: config.bgColor,
                borderColor: config.bgColor,
                fontWeight: 500,
                borderRadius: '6px',
                padding: '2px 10px',
            }}
        >
            {config.label}
        </Tag>
    );
};

export default StatusBadge;
