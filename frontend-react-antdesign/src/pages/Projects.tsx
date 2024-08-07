import React, { useState } from 'react'
import Dashboard from '../components/Dashboard'
import DataTable from '../components/DataTable';
import { Button, Drawer, Flex, Input, TableProps, Tag, Typography, Form, Row, Col, Select, message, Space, Divider, List, Popconfirm } from 'antd';
import { PlusOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';
import { DataType, ProjectDataType, UserDataType } from '../constants/interfaces';
import FormDrawer from '../components/FormDrawer';
import { projectService } from '../services/projectService';
import { useAuth } from '../contexts/authContext';
import { convertUtcToLocal } from '../utils/helpers';
import { userService } from '../services/userServices';

const { Title } = Typography;


const ProjectComponent: React.FC = () => {
  const columns: TableProps<ProjectDataType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Members',
      dataIndex: 'users',
      key: 'users',
      render: (users) => users?.length,
    },
    {
      title: 'Tasks',
      dataIndex: 'tasks',
      key: 'tasks',
      render: (tasks) => tasks?.length,
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => <a>{convertUtcToLocal(text)}</a>
    }
  ];

  const [editItem, setEditItem] = useState<ProjectDataType | null>(null);
  const [assignMember, setAssignMember] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [projects, setProjects] = useState<ProjectDataType[]>([]);

  const showDrawer = () => setOpen(true);
  const hideDrawer = () => { setOpen(false); setAssignMember(false) };

  const { token, getRole, getCurrentUserId } = useAuth();
  const role = getRole();
  const user_id = getCurrentUserId();
  const fetchProjects = async () => {
    try {
      const response = role == 'admin' ? await projectService.getProjects(token) : await projectService.getUserProjects(user_id, token);
      // console.log(response);
      setProjects(response);
      message.success("Project fetched...");
    } catch (error) {
      console.error('Error fetching Project:', error);
    }
  };

  const handleSubmitForm = async (data) => {
    // console.log('project data:', data);
    if (data.id && data.id != 0 && data.id != null) {
      const { id, ...restdata } = data;
      const response = await projectService.updateProject(id, restdata, token);
      console.log("response", response);
      if (response.id) {
        setProjects((prevProjects) => prevProjects.map(project => project.id === data.id ? response : project));
        hideDrawer();
        message.success("Project Updated Successfully");
      } else {
        message.error(response);
      }
    } else {
      const { _id, ...projectDataWithoutId } = data;
      const response = await projectService.createProject(projectDataWithoutId, token);
      if (response.id) {
        setProjects((prevProjects) => [...prevProjects, response as ProjectDataType]);
        message.success("Project Added Successfully");
        hideDrawer();
      } else {
        message.error(response);
      }
    }
  };

  const deleteHandler = async (id: number) => {
    // console.log("project id: ", id);
    const response = await projectService.deleteProject(id, token);
    if (response.id) {
      setProjects((prevProjects) => prevProjects.filter(project => project.id !== id));
      message.success("Project Deleted Successfully");
    } else {
      message.error(response.response.data.message);
    }
  }

  React.useEffect(() => {
    fetchProjects();
  }, []);

  return <div>
    <Flex wrap gap="small" justify="space-between" align="center" style={{ margin: "20px 0px" }}>
      <Title level={2} style={{ margin: 0 }}>Projects</Title>
      <Space>
        {role == 'admin' && <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
          New Project
        </Button>}
        <Button type="primary" onClick={fetchProjects} icon={<ReloadOutlined />}></Button>
      </Space>
    </Flex>
    <DataTable columns={columns} data={projects} setEditItem={setEditItem} showDrawer={showDrawer} deleteHandler={deleteHandler} task={true} member={true} setAssignMember={setAssignMember} />
    <ProjectManager open={open} hideDrawer={hideDrawer} editItem={editItem} handleSubmitForm={handleSubmitForm} assignMember={assignMember} />
  </div>;
}


const ProjectManager: React.FC<{ open: boolean; assignMember: boolean; hideDrawer: () => void; editItem: ProjectDataType | null; handleSubmitForm: (data: any) => void }> = ({ open, assignMember, hideDrawer, editItem, handleSubmitForm }) => {
  const { Option } = Select;
  const [form] = Form.useForm();

  const { token } = useAuth();
  const [projectId, setProjectId] = useState<number>(0);

  React.useEffect(() => {
    if (editItem) {
      setProjectId(editItem.id);
      setAddedUsers(editItem.users);
      form.setFieldsValue({
        id: editItem.id ? editItem.id : null,
        name: editItem.name,
      });
    } else {
      form.resetFields();
    }
  }, [editItem, form]);

  const onFinish = (values: any) => {
    // console.log('Form values:', values);
    handleSubmitForm(values);
  };

  const [users, setUsers] = useState<UserDataType[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers(token);
      // console.log(response);
      setUsers(response);
      message.success("Users fetched...");
    } catch (error) {
      console.error('Error fetching Users:', error);
    }
  };

  const [selectedUser, setSelectedUser] = useState<number>(0);
  const [addedUsers, setAddedUsers] = useState<UserDataType[]>([]);

  const handleAddUser = async () => {
    // console.log(selectedUser);
    try {
      const response = await projectService.assignUserToProject(projectId, selectedUser, token);
      setAddedUsers(response.users);
      message.success("User Assigned Successfully...");
    } catch (error) {
      console.error('Error Assigning User:', error);
      message.error("Error in User Assigning ...");
    }
  };

  const handleRemoveUser = async (id: number) => {
    // setAddedUsers(addedUsers.filter(user => user.id !== id));
    try {
      const response = await projectService.unassignUserToProject(projectId, id, token);
      setAddedUsers(response.users);
      message.success("User unassigned Successfully...");
    } catch (error) {
      console.error('Error unassigning User:', error);
      message.error("Error in User unassigning ...");
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Drawer
      title={editItem ? (assignMember ? 'Assign Members to Project' : 'Edit Project') : 'Create a new Project'}
      width={720}
      onClose={hideDrawer}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Form form={form} layout="vertical" hideRequiredMark onFinish={onFinish}>
        <Row gutter={16} style={{ display: 'none' }}>
          <Col span={24}>
            <Form.Item
              name="id"
            // rules={[{ required: true, message: 'Please enter the title' }]}
            >
              <Input placeholder="Please enter the title" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Project Name"
              rules={[{ required: true, message: 'Please enter the Name' }]}
            >
              <Input disabled={assignMember} placeholder="Please enter the Name" />
            </Form.Item>
          </Col>
        </Row>
        {assignMember && <><Divider orientation="left">Members</Divider>
          <Row gutter={16}>
            <Col span={20}>
              <Form.Item
                name="user"
                // label="Role"
                rules={[{ required: true, message: 'Please select a role' }]}
              >
                <Select placeholder="Please select a person to assign to" onChange={(value) => setSelectedUser(value)}>
                  {users && users.map((user, index) => <Option value={user.id} key={index}>{user.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item>
                <Button type="primary" onClick={handleAddUser}>
                  Add
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <List
                bordered
                dataSource={addedUsers}
                renderItem={user => (
                  <List.Item
                    // actions={[<Button type="link" onClick={() => console.log(user.id)}>Remove</Button>]}
                    actions={[
                      <Popconfirm
                        placement="bottomRight"
                        title={"Are you sure, you want to unassigned user from this project?"}
                        // description={"Logout Now!!"}
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleRemoveUser(user.id)}
                      >
                        <Button type="link">Remove</Button>
                      </Popconfirm>
                    ]}
                  >
                    <UserOutlined /> {user.name}
                  </List.Item>
                )}
              />
            </Col>
          </Row></>}
        {!assignMember && <Row>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Col>
        </Row>}
      </Form>
    </Drawer>
  );
};
export const Project = () => <Dashboard innerComponent={ProjectComponent} />
