import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const withAuthRedirect = (WrappedComponent: FC) => (props: any) => {
  const { authenticated } = useAuth();
  return authenticated ? <Navigate to="/" replace /> : <WrappedComponent {...props} />;
};

export default withAuthRedirect;