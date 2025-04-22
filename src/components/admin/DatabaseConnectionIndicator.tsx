import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const DatabaseConnectionIndicator: React.FC = () => {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc('check_database_connection');
        
        if (error) {
          console.error('Error checking database connection:', error);
          setConnected(false);
        } else {
          setConnected(data?.connected || false);
        }
      } catch (err) {
        console.error('Failed to check database connection:', err);
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
    
    // Check connection every 5 minutes
    const interval = setInterval(checkConnection, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
        <Database className="w-4 h-4 text-gray-500 mr-1.5" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (connected === true) {
    return (
      <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
        <CheckCircle className="w-4 h-4 text-green-500 mr-1.5" />
        <span className="text-xs font-medium text-green-700">Connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center bg-red-50 px-3 py-1 rounded-full">
      <AlertTriangle className="w-4 h-4 text-red-500 mr-1.5" />
      <span className="text-xs font-medium text-red-700">Disconnected</span>
    </div>
  );
};

export default DatabaseConnectionIndicator;