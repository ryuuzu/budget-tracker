import { createBrowserRouter } from 'react-router-dom';

import AuthLayout from './layouts/AuthLayout';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/authentication/Login';
import Register from './pages/authentication/Register';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthenticatedLayout />,
    children: [{ path: '/', element: <Dashboard /> }],
  },
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
]);
