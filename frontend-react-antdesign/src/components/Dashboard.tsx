import React, { useEffect, useState } from 'react';
import { blue } from '@ant-design/colors';
import { UnorderedListOutlined, UserOutlined, ProjectOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar, Button, Checkbox, Col, Drawer, Flex, Form, Input, Layout, Menu, message, Popconfirm, Row, Space, Tag, theme, Tooltip } from 'antd';
import DynamicBreadcrumbs from './DynamicBreadcrumbs';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { getTokenData } from '../utils/helpers';
import { userService } from '../services/userServices';

const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;


interface DashboardProps {
  innerComponent: React.FC;
}

const Dashboard: React.FC<DashboardProps> = ({ innerComponent: InnerComponent }) => {
  const { getRole } = useAuth();
  const role = getRole()
  // console.log("getCurrentUserId", getCurrentUserId())

  const items = [
    { title: "Projects", icon: ProjectOutlined, url: "/projects" },
    // { title: "Tasks", icon: UnorderedListOutlined, url: "/tasks" },
    { title: "Users", icon: UserOutlined, url: "/users" }
  ].map(
    (item, index) => ((role == 'admin') ? {
      key: String(index + 1),
      icon: React.createElement(item.icon),
      label: item.title,
      url: item.url,
    } : (item.title != 'Users') && {
      key: String(index + 1),
      icon: React.createElement(item.icon),
      label: item.title,
      url: item.url,
    }),
  );

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const showDrawer = () => setOpen(true);
  const hideDrawer = () => setOpen(false);

  const handleMenuClick = (item: any) => {
    const selectedItem = items.find(i => i.key === item.key);
    if (selectedItem) {
      navigate(selectedItem.url);
    }
  };

  return (
    <Layout>
      <Sider
        style={{ background: colorBgContainer }}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          // console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          // console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" >
          <h1 style={{ textAlign: "center", color: '#1890ff' }}>TMS</h1>
        </div>
        <Menu mode="inline" defaultSelectedKeys={['1']} items={items} onClick={handleMenuClick} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: "#1890ff" }} >
          <div style={{ marginRight: 20, marginLeft: 20 }}>
            <Flex wrap justify='space-between' align='center'>

              <Title level={3} style={{ margin: 0, color: "#fff" }}>Task Management Application</Title>
              <Space wrap size={8}>
                {/* <Tag color="processing">success</Tag>
                <Button type="primary">
                  Click me!
                </Button> */}
                <Tooltip title="User Profile" placement="bottom">
                  <Avatar icon={<UserOutlined />} onClick={() => showDrawer()} />
                </Tooltip>
                {/* <Avatar icon={<LogoutOutlined />} /> */}
                <Popconfirm
                  placement="bottomRight"
                  title={"Are you sure you want to logout?"}
                  description={"Logout Now!!"}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => { logout(), navigate("/login") }}
                >
                  <Tooltip title="logout" placement="bottom">
                    <Button shape="circle" style={{ background: "#00000040", borderColor: '#00000040', color: "#FFF" }} icon={<LogoutOutlined />} />
                  </Tooltip>
                </Popconfirm>
              </Space>

            </Flex>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: "80vh",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <DynamicBreadcrumbs />
            <InnerComponent />
            <Profile open={open} hideDrawer={hideDrawer} />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          TMA ©{new Date().getFullYear()} Created by Abdul Ahad Mansoori
        </Footer>
      </Layout>
    </Layout>
  );
};

const Profile: React.FC<{ open: boolean; hideDrawer: () => void }> = ({ open, hideDrawer }) => {

  const { token } = useAuth();
  const [user, setUser] = useState<any>({});
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const fetchUser = async () => {
    try {
      const response = await userService.getUser(token);
      setUser(response);
      message.success("User fetched...");
    } catch (error) {
      console.error('Error fetching Users:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        id: user.id,
        name: user.name,
        email: user.email,
        password: '',  // Clear password field if it was pre-filled
      });
    } else {
      form.resetFields();
    }
  }, [user, form]);

  const onFinish = async (values: any) => {
    const finalValues = { ...values };

    // Remove password field if checkbox is not checked
    if (!passwordVisible) {
      delete finalValues.password;
    }

    console.log("values", finalValues);

    const response = await userService.updateUser(finalValues.id, { ...finalValues, role: "user" }, token);
    if (response.id) {
      message.success("Profile Updated Successfully");
      hideDrawer();
    } else {
      message.error(response);
    }
  }

  const handlePasswordChange = (e: any) => {
    setPasswordVisible(e.target.checked);
    if (!e.target.checked) {
      form.setFieldsValue({ password: '' }); // Clear password field when checkbox is unchecked
    }
  }

  return (
    <Drawer
      title={"User Profile"}
      width={420}
      onClose={hideDrawer}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Form form={form} layout="vertical" hideRequiredMark onFinish={onFinish}>
        <Row gutter={16} style={{ display: 'none' }}>
          <Col span={24}>
            <Form.Item name="id">
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
          <Col span={24}>
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
            <Form.Item>
              <Checkbox onChange={handlePasswordChange}>
                Change Password
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
        {passwordVisible && (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="password"
                label="New Password"
                rules={[{ required: passwordVisible, message: 'Please enter your password!' }]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
            </Col>
          </Row>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default Dashboard;