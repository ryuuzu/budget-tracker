import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/components/contexts/auth-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  });

  const { toast } = useToast();
  const { loginUser } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      loginUser(loginDetails.email, loginDetails.password);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Login Failed!',
          description: error.message,
        });
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <form className="w-1/4" onSubmit={handleLogin}>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Welcome to Budget Tracker!</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <Input
              placeholder="Email"
              value={loginDetails.email}
              type="email"
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, email: e.target.value })
              }
            />
            <Input
              placeholder="Password"
              type="password"
              value={loginDetails.password}
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, password: e.target.value })
              }
            />
            <Button className="mt-2">Log In</Button>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm w-full">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-primary">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default LoginPage;
