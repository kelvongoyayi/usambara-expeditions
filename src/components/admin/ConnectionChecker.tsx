import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AlertTriangle, CheckCircle, Database, RefreshCw } from 'lucide-react';

interface ConnectionStatus {
  connected: boolean;
  timestamp: string;
  database_version: string;
}

interface DatabaseStats {
  tours_count: number;
  events_count: number;
  bookings_count: number;
  profiles_count: number;
  tour_categories_count: number;
  event_types_count: number;
  admin_logs_count: number;
  tables: Array<{
    table_name: string;
    row_count: number;
  }>;
}

interface SampleDataStatus {
  tour_categories_exist: boolean;
  event_types_exist: boolean;
  sample_tours_exist: boolean;
  sample_events_exist: boolean;
  tour_categories: Array<{
    id: string;
    name: string;
  }>;
  event_types: Array<{
    id: string;
    name: string;
  }>;
  sample_tours: Array<{
    id: string;
    title: string;
  }>;
  sample_events: Array<{
    id: string;
    title: string;
  }>;
}

const ConnectionChecker: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [databaseStats, setDatabaseStats] = useState<DatabaseStats | null>(null);
  const [sampleDataStatus, setSampleDataStatus] = useState<SampleDataStatus | null>(null);
  const [expanded, setExpanded] = useState(false);

  const checkConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check database connection
      const { data: connectionData, error: connectionError } = await supabase.rpc('check_database_connection');
      
      if (connectionError) throw connectionError;
      setConnectionStatus(connectionData);
      
      // Get database stats
      const { data: statsData, error: statsError } = await supabase.rpc('get_database_stats');
      
      if (statsError) throw statsError;
      setDatabaseStats(statsData);
      
      // Verify sample data
      const { data: sampleData, error: sampleError } = await supabase.rpc('verify_sample_data');
      
      if (sampleError) throw sampleError;
      setSampleDataStatus(sampleData);
      
    } catch (err) {
      console.error('Error checking connection:', err);
      setError(err instanceof Error ? err.message : 'Failed to check connection');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div className="flex items-center">
          <Database className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Database Connection Status</h3>
        </div>
        <button
          onClick={checkConnection}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          title="Refresh connection status"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-600"></div>
            <span className="ml-3 text-gray-600">Checking connection...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  <p className="mt-2">
                    Please check your Supabase connection settings and ensure your database is properly configured.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center mb-4">
                {connectionStatus?.connected ? (
                  <div className="flex items-center text-green-700 bg-green-50 px-3 py-2 rounded-full">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Connected to Supabase</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-700 bg-red-50 px-3 py-2 rounded-full">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Not connected to Supabase</span>
                  </div>
                )}
              </div>
              
              {connectionStatus && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Connection Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Database Version:</span> {connectionStatus.database_version}</p>
                      <p><span className="font-medium">Last Checked:</span> {new Date(connectionStatus.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {databaseStats && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Database Statistics</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Tours:</span> {databaseStats.tours_count}</p>
                        <p><span className="font-medium">Events:</span> {databaseStats.events_count}</p>
                        <p><span className="font-medium">Tour Categories:</span> {databaseStats.tour_categories_count}</p>
                        <p><span className="font-medium">Event Types:</span> {databaseStats.event_types_count}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {sampleDataStatus && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Data Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="font-medium mr-2">Tour Categories:</span>
                        {sampleDataStatus.tour_categories_exist ? (
                          <span className="text-green-600 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" /> Available
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-1" /> Missing
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mb-2">
                        <span className="font-medium mr-2">Event Types:</span>
                        {sampleDataStatus.event_types_exist ? (
                          <span className="text-green-600 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" /> Available
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-1" /> Missing
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="font-medium mr-2">Sample Tours:</span>
                        {sampleDataStatus.sample_tours_exist ? (
                          <span className="text-green-600 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" /> Available
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-1" /> Missing
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mb-2">
                        <span className="font-medium mr-2">Sample Events:</span>
                        {sampleDataStatus.sample_events_exist ? (
                          <span className="text-green-600 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" /> Available
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-1" /> Missing
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-brand-600 hover:text-brand-700 font-medium text-sm flex items-center"
                  >
                    {expanded ? 'Hide Details' : 'Show Details'}
                    <svg
                      className={`ml-1 w-4 h-4 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expanded && (
                    <div className="mt-4 space-y-4">
                      {sampleDataStatus.tour_categories?.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Tour Categories</h5>
                          <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                            <ul className="space-y-1">
                              {sampleDataStatus.tour_categories.map((category) => (
                                <li key={category.id} className="text-sm">
                                  <span className="font-medium">{category.name}</span> ({category.id})
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      
                      {sampleDataStatus.event_types?.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Event Types</h5>
                          <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                            <ul className="space-y-1">
                              {sampleDataStatus.event_types.map((type) => (
                                <li key={type.id} className="text-sm">
                                  <span className="font-medium">{type.name}</span> ({type.id})
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      
                      {sampleDataStatus.sample_tours?.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Sample Tours</h5>
                          <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                            <ul className="space-y-1">
                              {sampleDataStatus.sample_tours.map((tour) => (
                                <li key={tour.id} className="text-sm">
                                  <span className="font-medium">{tour.title}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      
                      {sampleDataStatus.sample_events?.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Sample Events</h5>
                          <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                            <ul className="space-y-1">
                              {sampleDataStatus.sample_events.map((event) => (
                                <li key={event.id} className="text-sm">
                                  <span className="font-medium">{event.title}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Database className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Connection Information</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Your application is connected to Supabase. The database contains the necessary tables and sample data for tours, events, categories, and types.</p>
                    <p className="mt-2">
                      You can now use the admin dashboard to create, update, and delete tours and events. All changes will be stored in the database.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectionChecker;