import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Row, Col, Select, Typography, Space, Tree, Drawer, message, Popover, Card, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { tasksService } from '../services/taskService';
import { useAuth } from '../contexts/authContext';
import { useSearchParams } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import { ProjectDataType, UserDataType } from '../constants/interfaces';
import { userService } from '../services/userServices';
import { projectService } from '../services/projectService';
import { convertUtcToLocal } from '../utils/helpers';

const { Title } = Typography;
const { Option } = Select;
const { TreeNode } = Tree;

interface TaskDataType {
  id: number;
  key: number;
  parent_task: string;
  project: string;
  title: string;
  description: string;
  status: string;
  assigned_to: string;
  children?: TaskDataType[];
}

const TaskComponent: React.FC = () => {
  const [editItem, setEditItem] = useState<TaskDataType | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskDataType | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskDataType[]>([]);
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project_id');

  const fetchTasks = async () => {
    try {
      const response = await tasksService.getTasks(projectId, token);
      // console.log(response);
      setTasks(response);
      message.success("Tasks fetched...");
    } catch (error) {
      console.error('Error fetching Tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId, token]);

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    // Handle task selection if needed
    // console.log('Selected:', selectedKeys, info);
    setSelectedTask(info.node.dataRef)
  };

  const onExpand = (expandedKeys: React.Key[], info: any) => {
    // Handle task expansion if needed
    // console.log('Expanded:', expandedKeys, info);
  };

  const showDrawer = () => setOpen(true);
  const hideDrawer = () => setOpen(false);

  const editTask = (task: TaskDataType) => {
    setEditItem(task);
    showDrawer();
  };

  const handleAddNewTask = () => {
    setEditItem(null);
    showDrawer();
  };

  const handleDeleteTask = (task: TaskDataType) => {
    // Implement task deletion here
    // console.log('Delete task:', task);
    deleteHandler(task.id);
  };

  const handleViewTask = (task: TaskDataType) => {
    // Implement task viewing here
    // console.log('View task:', task);
  };

  const deleteHandler = async (taskid: number) => {
    // console.log("project id: ", taskid);
    const response = await tasksService.deleteTask(projectId, taskid, token);
    message.success("Task Deleted Successfully");
    fetchTasks();
  }

  const handleSubmitForm = async (data: TaskDataType) => {
    console.log("asb");
    if (data.id && data.id != 0 && data.id != null) {
      const { id, ...restdata } = data;
      const response = await tasksService.updateTask(projectId, id, restdata, token);
      fetchTasks();
      hideDrawer();
      message.success("Task Updated Successfully");
    } else {
      const { _id, ...projectDataWithoutId } = data;
      const response = await tasksService.createTask(projectId, projectDataWithoutId, token);
      if (response.id) {
        fetchTasks();
        message.success("Task Added Successfully");
        hideDrawer();
      } else {
        message.error(response);
      }
    }
  };

  const renderTreeNodes = (tasks: TaskDataType[]) =>
    tasks.map(task => (
      <TreeNode
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {task.title}
            <Popover
              content={
                <div>
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => editTask(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteTask(task)}
                  >
                    Delete
                  </Button>
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewTask(task)}
                  >
                    View
                  </Button>
                </div>
              }
              trigger="click"
            >
              <Button type="link">Actions</Button>
            </Popover>
          </div>
        }
        key={task.key}
        dataRef={task}
      >
        {task.children && renderTreeNodes(task.children)}
      </TreeNode>
    ));

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Title level={2} style={{ margin: 0 }}>Tasks</Title>
        <Button type="primary" onClick={handleAddNewTask} icon={<PlusOutlined />}>
          New Task
        </Button>
      </Space>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          {(tasks && tasks.length > 0) ? (<Tree
            onSelect={onSelect}
            onExpand={onExpand}
            expandAction="click"
          >
            {renderTreeNodes(tasks)}
          </Tree>) : (<p>This project not have tasks!! </p>)}
        </Col>
        <Col className="gutter-row" span={18}>
          {selectedTask && <ViewTask task={selectedTask} />}
        </Col>
      </Row>

      <TaskManager open={open} hideDrawer={hideDrawer} editItem={editItem} handleSubmitForm={handleSubmitForm} />
    </div>
  );
};

const TaskManager: React.FC<{ open: boolean; hideDrawer: () => void; handleSubmitForm: (data: object) => void; editItem: TaskDataType | null }> = ({ open, hideDrawer, handleSubmitForm, editItem }) => {
  const [form] = Form.useForm();
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project_id');

  const [users, setUsers] = useState<UserDataType[]>([]);
  const [projects, setProjects] = useState<ProjectDataType[]>([]);
  const [tasks, setTasks] = useState<TaskDataType[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers(token);
      setUsers(response);
      message.success("Users fetched...");
    } catch (error) {
      console.error('Error fetching Users:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projectService.getProjects(token);
      setProjects(response);
      message.success("Projects fetched...");
    } catch (error) {
      console.error('Error fetching Projects:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await tasksService.getTaskOptions(projectId, token);
      setTasks(response);
      message.success("Tasks fetched...");
    } catch (error) {
      console.error('Error fetching Tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchUsers();
  }, [projectId, token]);

  useEffect(() => {
    if (editItem) {
      form.setFieldsValue({
        id: editItem.id,
        title: editItem.title,
        description: editItem.description,
        parent_id: editItem.parent_task,
        project_id: editItem.project,
        assigned_to: editItem.assigned_to,
        status: editItem.status,
      });
    } else {
      form.resetFields();
    }
  }, [editItem, form]);

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    handleSubmitForm(values);
  };

  return (
    <Drawer
      title={editItem ? 'Edit Task' : 'Create a new Task'}
      width={720}
      onClose={hideDrawer}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          </Col>
        </Row>
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
              name="parent_id"
              label="Parent Task"
            >
              <Select placeholder="Please select a parent task">
                {tasks.map((task) => (
                  <Option key={task.id} value={task.id}>{task.title}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="project_id"
              label="Project"
              rules={[{ required: true, message: 'Please select a project' }]}
            >
              <Select placeholder="Please select a project">
                {projects.map((project) => (
                  <Option key={project.id} value={project.id}>{project.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="assigned_to"
              label="Assigned To"
            >
              <Select placeholder="Please select a person to assign to">
                {users.map((user) => (
                  <Option key={user.id} value={user.id}>{user.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select a status' }]}
            >
              <Select placeholder="Please select a status">
                <Option value="open">Open</Option>
                <Option value="in_progress">In Progress</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editItem ? 'Update Task' : 'Create Task'}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

const ViewTask = ({ task }) => {
  const { Text, Link } = Typography;
  return <>
    <Card title={task.title} extra={<Tag color="success">{task.status}</Tag>} style={{ width: "100%" }}>
      <Space direction="vertical">
        <Text type="secondary">{convertUtcToLocal(task.timestamp)}</Text>
        <Text>{task.description}</Text>
      </Space>
    </Card>
  </>
}

export const Task = () => <Dashboard innerComponent={TaskComponent} />;