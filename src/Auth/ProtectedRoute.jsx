import React from 'react';
import { useAuth } from './AuthProvider';
import { Navigate } from 'react-router-dom';
import PermissionDenied from '../Pages/Permission-Denied/PermissionDenied';
export default function ProtectedRoute({
  allowedRoles,
  children,
}) {
  const { user } = useAuth();

  if (user === null) {
    return <Navigate to="/login"></Navigate>
  }

  if  ( user === undefined || (allowedRoles && !allowedRoles.includes(user.role)) ){
   {
    return <PermissionDenied />;
  }
  }
  return children;
}