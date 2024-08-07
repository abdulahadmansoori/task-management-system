import React from 'react';
import { Button, Form, Input, message, Row, Col, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authServices';
import { useAuth } from '../../contexts/authContext';

const { Title } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [submittable, setSubmittable] = React.useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Watch all values
  const values = Form.useWatch([], form);

  React.useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  // Handle form submission
  const { token } = useAuth();
  const handleSubmit = async (values: any) => {
    try {
      // console.log('Form Submitted:', values);
      const response = await authService.loginUser(values.username, values.password, token);
      console.log(response);
      if (response.access_token) {
        login(response.access_token);
        message.success('Login successful!');
        navigate("/");
      } else {
        message.error('Login failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      message.error('Login failed. Please try again.');
    }
  };

  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col xs={24} sm={18} md={12} lg={8}>
        <div style={{ textAlign: 'center', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <Title level={2}>Login</Title>
          <Form
            form={form}
            name="login"
            layout="vertical"
            autoComplete="off"
            onFinish={handleSubmit}
            style={{ maxWidth: '400px', margin: '0 auto' }} // Set form width and center it
          >
            <Form.Item
              name="username"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                // { type: 'text', message: 'Please enter a valid email!' }
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!submittable}
                style={{ width: '100%' }} // Full width button
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Login;
