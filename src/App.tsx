import { RouterProvider } from 'react-router-dom';

import { ThemeProvider } from '@/components/contexts/theme-provider';
import { Toaster } from '@/components/ui/toaster';

import { AuthProvider } from './components/contexts/auth-provider';
import { LocalStorageProvider } from './components/contexts/localstorage-provider';
import { router } from './router';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LocalStorageProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </LocalStorageProvider>
    </ThemeProvider>
  );
}

export default App;
