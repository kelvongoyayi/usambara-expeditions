import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AdminProvider } from './contexts/AdminContext';
import { useAuth } from './contexts/AuthContext';
import { router } from './lib/router';

function App() {
  const { error, clearAuthError } = useAuth();
  
  useEffect(() => {
    // Handle authentication errors
    if (error) {
      console.error('Authentication error:', error);
      clearAuthError();
    }
  }, [error, clearAuthError]);

  return (
    <AdminProvider>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 2500,
            icon: '🎉',
          },
          error: {
            duration: 4000,
            icon: '❌',
          },
        }}
      />
    </AdminProvider>
  );
}

export default App;