import React, { useEffect } from 'react';
import { Button, Form, Input, Row, Col, Select, Typography, Space } from 'antd';
import { TaskDataType } from '../constants/interfaces';

const { Option } = Select;

interface TaskFormProps {
    editItem: TaskDataType | null;
    onFinish: (values: TaskDataType) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ editItem, onFinish }) => {
    const [form] = Form.useForm();

    // Set form values when editItem changes
    useEffect(() => {
        if (editItem) {
            form.setFieldsValue(editItem);
        }
    }, [editItem, form]);

    return (
        <Form
            form={form}
            layout="vertical"
            hideRequiredMark
            onFinish={onFinish}
        >
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please enter the title' }]}
                    >
                        <Input placeholder="Please enter the title" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter the description' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Please enter the description" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="parent_task"
                        label="Parent Task"
                        rules={[{ required: true, message: 'Please select a parent task' }]}
                    >
                        <Select placeholder="Please select a parent task">
                            <Option value="">---select---</Option>
                            <Option value="task1">Task 1</Option>
                            <Option value="task2">Task 2</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="project"
                        label="Project"
                        rules={[{ required: true, message: 'Please select a project' }]}
                    >
                        <Select placeholder="Please select a project">
                            <Option value="project1">Project 1</Option>
                            <Option value="project2">Project 2</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="assigned_to"
                        label="Assigned To"
                        rules={[{ required: true, message: 'Please select a person to assign to' }]}
                    >
                        <Select placeholder="Please select a person to assign to">
                            <Option value="">---select---</Option>
                            <Option value="user1">User 1</Option>
                            <Option value="user2">User 2</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Please select the status' }]}
                    >
                        <Select placeholder="Please select the status">
                            <Option value="open">Open</Option>
                            <Option value="in_progress">In Progress</Option>
                            <Option value="closed">Closed</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default TaskForm;
