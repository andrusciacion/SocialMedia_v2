import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './LoginPage/LoginPage';
import Register from './RegisterPage/RegisterPage';
import Home from './HomePage/HomePage';
import Profile from './ProfilePage/ProfilePage';
import Photos from './PhotosPage/PhotosPage';
import Friends from './FriendsPage/FriendsPage';
import Error from './ErrorPage/ErrorPage';
import ProtectedRoute from './ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import Unauthorized from './Unauthorized/UnauthorizedPage';

const URL_REQUEST = 'http://localhost:3004/';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
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
        <Route path='/unauthorized' element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}
