import React, { useState } from 'react';
import Dashboard from '../components/Dashboard';
import DataTable from '../components/DataTable';
import { Button, Col, Drawer, Flex, Input, Row, Select, Space, TableProps, Typography, Form, Col as AntCol, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DataType, UserDataType } from '../constants/interfaces';
import { convertUtcToLocal } from '../utils/helpers';
import { useAuth } from '../contexts/authContext';
import { userService } from '../services/userServices';

const { Title } = Typography;
const { Option } = Select;

const UserComponent: React.FC = () => {
  const [editItem, setEditItem] = useState<UserDataType | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [form] = Form.useForm();

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    // {
    //   title: 'Username',
    //   dataIndex: 'username',
    //   key: 'username',
    // },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => <a>{convertUtcToLocal(text)}</a>
    },
  ];

  const [users, setUsers] = useState<UserDataType[]>([]);
  const showDrawer = () => setOpen(true);
  const hideDrawer = () => setOpen(false);

  const { token } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers(token);
      setUsers(response);
      message.success("Users fetched...");
    } catch (error) {
      console.error('Error fetching Users:', error);
    }
  };

  const deleteHandler = async (id: number) => {
    const response = await userService.deleteUser(id, token);
    if (response.id) {
      setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
      message.success("User Deleted Successfully");
    } else {
      message.error(response.detail);
    }
  }

  const onFinish = async (values: any) => {
    if (values.id && values.id != 0 && values.id != null) {
      const { id, ...restdata } = values;
      const response = await userService.updateUser(id, restdata, token);
      if (response.id) {
        setUsers((prevUsers) => prevUsers.map(project => project.id === values.id ? response : project));
        hideDrawer();
        message.success("User Updated Successfully");
      } else {
        message.error(response);
      }
    } else {
      const { id, ...rest } = values;
      const response = await userService.createUser(rest, token);
      if (response.id) {
        setUsers((prevUsers) => [...prevUsers, response as UserDataType]);
        message.success("User Added Successfully");
        hideDrawer();
      } else {
        message.error(response);
      }
    }

    hideDrawer();
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  React.useEffect(() => {
    if (editItem) {
      form.setFieldsValue({
        id: editItem.id ? editItem.id : null,
        name: editItem.name,
        email: editItem.email,
        password: editItem.password != "" ? editItem.password : null,
        role: editItem.role,
      });
    } else {
      form.resetFields();
    }
  }, [editItem, form]);

  return (
    <div>
      <Flex wrap gap="small" justify="space-between" align="center" style={{ margin: "20px 0px" }}>
        <Title level={2} style={{ margin: 0 }}>Users</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>
          New User
        </Button>
      </Flex>
      <DataTable columns={columns} data={users} setEditItem={setEditItem} showDrawer={showDrawer} deleteHandler={deleteHandler} />
      <Drawer
        title={editItem ? 'Edit User' : 'Create a new User'}
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
              >
                <Input placeholder="Please enter the title" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter the name' }]}
              >
                <Input placeholder="Please enter the name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please select a role' }]}
              >
                <Select placeholder="Please select a role to assign to">
                  <Option value="user">User</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Please enter the email' }]}
              >
                <Input placeholder="Please enter the email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: editItem ? false : true, message: 'Please enter the password' }]}
              >
                <Input placeholder="Please enter the password" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {editItem ? 'Update' : 'Submit'}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export const User = () => <Dashboard innerComponent={UserComponent} />;
