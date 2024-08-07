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

const Register = () => {
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { toast } = useToast();
  const { registerUser } = useAuth();

  const handleRegister = (e) => {
    e.preventDefault();

    if (
      !registrationData.name ||
      !registrationData.email ||
      !registrationData.password
    ) {
      toast({
        title: 'Registration Failed!',
        description: 'Please fill in all fields',
      });
      return;
    }

    try {
      registerUser(
        registrationData.name,
        registrationData.email,
        registrationData.password
      );
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Registration Failed!',
          description: error.message,
        });
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <form className="w-2/3 md:w-1/2 xl:w-1/4" onSubmit={handleRegister}>
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Welcome to Budget Tracker!</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <Input
              placeholder="Name"
              value={registrationData.name}
              type="text"
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  name: e.target.value,
                })
              }
              required
            />
            <Input
              placeholder="Email"
              value={registrationData.email}
              type="email"
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  email: e.target.value,
                })
              }
              required
            />
            <Input
              placeholder="Password"
              type="password"
              value={registrationData.password}
              onChange={(e) =>
                setRegistrationData({
                  ...registrationData,
                  password: e.target.value,
                })
              }
              required
            />
            <Button className="mt-2">Register</Button>
          </CardContent>
          <CardFooter>
            <p className="w-full text-center text-sm">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-primary">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default Register;
