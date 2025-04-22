import React, { useState, useEffect } from 'react';
import { Tooltip } from '../ui/tooltip';
import { supabase } from '../../lib/supabase';
import { cn } from '../../utils/cn';

const DatabaseConnectionIndicator: React.FC = () => {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkConnection = async () => {
      if (!isMounted) return;
      if (!loading) setLoading(true);
      try {
        const { error } = await supabase.auth.getUser();
        if (!isMounted) return;
        if (error) {
          console.warn('DB connection check failed:', error.message);
          setConnected(false);
        } else {
          setConnected(true);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to check database connection:', err);
        setConnected(false);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  let statusColor = 'bg-gray-400';
  let statusText = 'Checking connection...';

  if (!loading) {
    if (connected === true) {
      statusColor = 'bg-green-500';
      statusText = 'Database Connected';
    } else if (connected === false) {
      statusColor = 'bg-red-500';
      statusText = 'Database Disconnected';
    }
  }

  return (
    <Tooltip content={statusText} side="bottom" delayDuration={100}>
      <div className="flex items-center justify-center w-6 h-6" aria-label={statusText}>
        <span 
          className={cn(
            'block w-2.5 h-2.5 rounded-full transition-colors duration-300',
            statusColor,
            loading && 'animate-pulse'
          )}
        />
      </div>
    </Tooltip>
  );
};

export default DatabaseConnectionIndicator;