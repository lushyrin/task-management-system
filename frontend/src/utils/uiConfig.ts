import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    MinusCircleOutlined,
} from '@ant-design/icons';
import React from 'react';
import type { TaskStatus } from '@/types';

export const STATUS_CONFIG: Record<TaskStatus, { color: string; icon: React.ReactNode; label: string }> = {
    not_started: { color: 'default', icon: React.createElement(MinusCircleOutlined), label: 'Not Started' },
    in_progress: { color: 'processing', icon: React.createElement(ClockCircleOutlined), label: 'In Progress' },
    done: { color: 'success', icon: React.createElement(CheckCircleOutlined), label: 'Done' },
};