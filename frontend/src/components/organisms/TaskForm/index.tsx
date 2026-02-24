import { useEffect } from 'react';
import { Form, Input, Select, Button, Space, Modal } from 'antd';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types';

const { TextArea } = Input;
const { Option } = Select;

interface TaskFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => void;
    task?: Task;
    isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
    visible,
    onCancel,
    onSubmit,
    task,
    isLoading = false,
}) => {
    const [form] = Form.useForm();
    const isEditMode = !!task;

    useEffect(() => {
        if (visible && task) {
            form.setFieldsValue({
                title: task.title,
                description: task.description,
                status: task.status,
            });
        } else if (visible) {
            form.resetFields();
        }
    }, [visible, task, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSubmit(values);
        } catch (error) {
            console.error('Form validation failed:', error);
        }
    };

    return (
        <Modal
            title={isEditMode ? 'Edit Task' : 'Create New Task'}
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    status: 'not_started',
                }}
            >
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[
                        { required: true, message: 'Please enter a title' },
                        { max: 200, message: 'Title must be less than 200 characters' },
                    ]}
                >
                    <Input placeholder="Enter task title" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                        { max: 2000, message: 'Description must be less than 2000 characters' },
                    ]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Enter task description (optional)"
                    />
                </Form.Item>

                {isEditMode && (
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Please select a status' }]}
                    >
                        <Select placeholder="Select status">
                            <Option value="not_started">Not Started</Option>
                            <Option value="in_progress">In Progress</Option>
                            <Option value="done">Done</Option>
                        </Select>
                    </Form.Item>
                )}

                <Form.Item className="mb-0 flex justify-end">
                    <Space>
                        <Button onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                        >
                            {isEditMode ? 'Update' : 'Create'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TaskForm;
