import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  let userID = localStorage.getItem('CurrentUserID');
  let token = document.cookie;
  return userID !== null && token !== 'false' ? (
    children
  ) : (
    <Navigate to='/unauthorized' replace />
  );
}
