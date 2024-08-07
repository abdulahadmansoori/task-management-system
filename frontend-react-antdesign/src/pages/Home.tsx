import React from 'react'
import Dashboard from '../components/Dashboard'
import DataTable from '../components/DataTable';
import { Button, Flex, Input, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Project } from './Projects';

// const { Title } = Typography;

// const HomeComponent: React.FC = () => {

//   return <div>
//     <Flex wrap gap="small" justify="space-between" align="center">
//       <Title level={2} style={{ margin: 0 }}>Projects</Title>
//       <Button type="primary" icon={<PlusOutlined />}>
//         Add
//       </Button>
//     </Flex>
//     <DataTable />
//   </div>;
// }

// export const Home = () => <Dashboard innerComponent={Project} />
export const Home = () => <Project />
