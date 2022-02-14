import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import Error from './ErrorPage/ErrorPage';
import Friends from './FriendsPage/FriendsPage';
import Home from './HomePage/HomePage';
import Login from './LoginPage/LoginPage';
import Photos from './PhotosPage/PhotosPage';
import Profile from './ProfilePage/ProfilePage';
import ProtectedRoute from './ProtectedRoute';
import Register from './RegisterPage/RegisterPage';
import Unauthorized from './Unauthorized/UnauthorizedPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route
          path='/home'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/photos'
          element={
            <ProtectedRoute>
              <Photos />
            </ProtectedRoute>
          }
        />
        <Route
          path='/friends'
          element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Error />} />
        <Route path='/register' element={<Register />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}
