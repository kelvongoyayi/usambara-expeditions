import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, InputField, Alert, CheckboxField } from '../../components/ui';
import UsambaraLogo from '../../components/ui/UsambaraLogo';
import toast from 'react-hot-toast';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isAdmin, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  // Get the redirect path from location state
  const from = location.state?.from?.pathname || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      toast.success('Successfully signed in');
      if (from.startsWith('/admin') && !isAdmin) {
        navigate('/access-denied');
      } else if (from.startsWith('/admin') && isAdmin) {
        navigate('/admin');
      } else {
        navigate(from);
      }
    }
  }, [user, isAdmin, navigate, from]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await signIn(
        formData.email, 
        formData.password
      );
      
      if (error) throw error;
      
      if (data) {
        toast.success('Successfully signed in');
        
        // Use a short timeout to allow the toast to be visible
        setTimeout(() => {
          // Redirect to admin dashboard if user is an admin, otherwise to home or from
          if (isAdmin && from.startsWith('/admin')) {
            navigate('/admin');
          } else if (isAdmin) {
            navigate('/admin');
          } else {
            navigate(from);
          }
        }, 300);
      }
    } catch (err) {
      console.error('Error during signin:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      toast.error('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back to Home Button */}
      <div className="fixed top-4 left-4 z-10">
        <Link 
          to="/"
          className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-md text-brand-600 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <UsambaraLogo width={80} height={80} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/auth/signup" className="font-medium text-brand-600 hover:text-brand-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <Alert 
              variant="error" 
              title="Authentication Error"
              className="mb-6"
              icon={<AlertCircle className="w-5 h-5" />}
            >
              {error}
            </Alert>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              icon={<Mail className="w-5 h-5 text-gray-400" />}
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              icon={<Lock className="w-5 h-5 text-gray-400" />}
            />

            <CheckboxField
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              label="Remember me"
            />

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Need help?
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                to="/auth/forgot-password"
                className="text-sm font-medium text-brand-600 hover:text-brand-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;