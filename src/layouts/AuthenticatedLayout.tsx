import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/components/contexts/auth-provider';

const AuthenticatedLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-[400px] md:w-[500px]">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
