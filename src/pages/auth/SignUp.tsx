import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, InputField, Alert, CheckboxField } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import UsambaraLogo from '../../components/ui/UsambaraLogo';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !success) {
      navigate('/');
    }
  }, [user, navigate, success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = (): boolean => {
    // Reset error
    setError(null);
    
    // Check for empty fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('All fields are required');
      return false;
    }
    
    // Validate email format
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Check password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    // Check terms agreement
    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms & Conditions');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      // Sign up the user
      const { data, error: signUpError } = await signUp(formData.email, formData.password);
      
      if (signUpError) throw signUpError;
      
      if (data.user) {
        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update profile with name
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.user.id);

        if (updateError) throw updateError;
        
        // Successful registration
        setSuccess(true);
        
        // Redirect to login page after showing success message
        setTimeout(() => {
          navigate('/auth/signin');
        }, 2000);
      }
    } catch (err) {
      console.error('Error during signup:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign up');
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
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/auth/signin" className="font-medium text-brand-600 hover:text-brand-500">
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <Alert 
              variant="error" 
              title="Registration Error"
              className="mb-6"
              icon={<AlertCircle className="w-5 h-5" />}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              variant="success" 
              title="Registration Successful"
              className="mb-6"
              icon={<ShieldCheck className="w-5 h-5" />}
            >
              Your account has been created successfully. You will be redirected to the login page.
            </Alert>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <InputField
                label="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                icon={<User className="w-5 h-5 text-gray-400" />}
              />

              <InputField
                label="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                icon={<User className="w-5 h-5 text-gray-400" />}
              />
            </div>

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
              helperText="At least 6 characters"
            />

            <InputField
              label="Confirm password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              icon={<Lock className="w-5 h-5 text-gray-400" />}
            />

            <CheckboxField
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              label={
                <span className="text-sm">
                  I agree to the{' '}
                  <a href="#" className="text-brand-600 hover:text-brand-500 font-medium">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-brand-600 hover:text-brand-500 font-medium">
                    Privacy Policy
                  </a>.
                </span>
              }
              required
            />

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;