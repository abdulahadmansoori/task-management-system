import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';

const { Option } = Select;

interface FormDrawerProps {
  title: string;
  FormComponent: React.FC<{ editItem: any | null }>;
  open: boolean;
  showDrawer: () => void;
  hideDrawer: () => void;
  editItem: any
}

const FormDrawer: React.FC<FormDrawerProps> = ({ title, FormComponent, open, showDrawer, hideDrawer, editItem }) => {

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        New {title}
      </Button>
      <Drawer
        title={'Create a new ' + title}
        width={720}
        onClose={hideDrawer}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <FormComponent editItem={editItem}/>
      </Drawer>
    </>
  );
};

export default FormDrawer;

