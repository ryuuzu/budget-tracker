import { UserIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/components/contexts/auth-provider';
import { useLocalStorage } from '@/components/contexts/localstorage-provider';
import { useTheme } from '@/components/contexts/theme-provider';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

const AuthenticatedLayout = () => {
  const { user, logoutUser } = useAuth();
  const { currentPage } = useLocalStorage();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-4/5 md:w-[500px]">
        <Card className="mb-4">
          <CardContent className="flex flex-col items-center justify-between px-4 py-2 md:flex-row">
            <div className="flex h-5 items-center gap-1 text-sm">
              <div>{currentPage}</div>
              <Separator orientation="vertical" />
              <div className="font-bold text-primary">Budget Tracker</div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-xs">
                <UserIcon className="w-4" />
                {user?.name}
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem
                  className="text-xs"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                >
                  {theme === 'light'
                    ? 'Switch to Dark Mode'
                    : 'Switch to Light Mode'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-xs"
                  onClick={() => logoutUser()}
                >
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
