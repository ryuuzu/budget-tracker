import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/components/contexts/auth-provider';

const AuthLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
