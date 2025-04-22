import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ChevronLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';

const AccessDenied: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
            <ShieldAlert className="h-10 w-10 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          
          <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
            Sorry, you don't have permission to access this page. This area is restricted to administrators only.
          </p>
          
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AccessDenied;