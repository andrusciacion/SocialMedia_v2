import React from 'react';
import { Navigate } from 'react-router-dom';

const URL_REQUEST = 'http://localhost:3004/';

export default function ProtectedRoute({ children }) {
  let userID = localStorage.getItem('CurrentUserID');
  let token = document.cookie;
  return userID !== null && token !== 'false' ? (
    children
  ) : (
    <Navigate to='/unauthorized' replace />
  );
}
