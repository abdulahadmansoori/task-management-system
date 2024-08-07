import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const DynamicBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <Breadcrumb separator=">">
      <Breadcrumb.Item>
        <RouterLink to="/">
          {/* <HomeOutlined /> */}
          Home
        </RouterLink>
      </Breadcrumb.Item>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const breadcrumbName = pathnames[index];

        return (
          <Breadcrumb.Item key={to}>
            {index === pathnames.length - 1 ? (
              <span>{breadcrumbName}</span>
            ) : (
              <RouterLink to={to}>{breadcrumbName}</RouterLink>
            )}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default DynamicBreadcrumbs;
