import React from 'react';
import { Button, Flex, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UsergroupAddOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { DataType, ProjectDataType } from '../constants/interfaces';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

interface DataTableProps {
    columns: TableProps<DataType | ProjectDataType>['columns'];
    data: DataType[];
    setEditItem: (data: ProjectDataType) => void;
    showDrawer: (state: boolean) => void;
    setAssignMember: (state: boolean) => void;
    deleteHandler: (id: number) => void;
    member: boolean;
    view: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ columns = [], data, setEditItem, setAssignMember, showDrawer, deleteHandler, task = false, member = false, view = false }) => {
    const navigate = useNavigate();
    const { getRole } = useAuth();
    const role = getRole()
    console.log("role", role);
    const enhancedColumns: TableProps<DataType | ProjectDataType>['columns'] = [
        ...columns,
        {
            title: 'Action',
            key: 'action',
            align:"center",
            render: (_, record) => (
                <Flex wrap gap="small" justify='center'>
                    {view && <Tooltip title="View" placement="left">
                        <Button shape="circle" icon={<EyeOutlined />} />
                    </Tooltip>}
                    {role == "admin" && member && <Tooltip title="Members" placement="left">
                        <Button shape="circle" icon={<UsergroupAddOutlined />} onClick={() => { setEditItem(record), showDrawer(true), setAssignMember(true) }} />
                    </Tooltip>}
                    {role == "admin" && <Tooltip title="Edit" placement="bottom">
                        <Button shape="circle" icon={<EditOutlined />} onClick={() => { setEditItem(record), console.log(record), showDrawer(true) }} />
                    </Tooltip>}
                    {task && <Tooltip title="Tasks" placement="bottom">
                        <Button shape="circle" icon={<UnorderedListOutlined />} onClick={() => { navigate(`/tasks?project_id=${record.id}`) }} />
                    </Tooltip>}
                    {role == "admin" && <Popconfirm
                        placement="bottomRight"
                        title={"Are you sure, you want to delete this?"}
                        // description={"Logout Now!!"}
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => deleteHandler(record.id)}
                    >
                        <Tooltip title="Delete" placement="right">
                            <Button shape="circle" icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>}
                </Flex>
            ),
        },
    ];

    return <Table columns={enhancedColumns} dataSource={data} bordered={true} />;
};

export default DataTable;