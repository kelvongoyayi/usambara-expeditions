import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ADMIN_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase client with service role key for admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// SQL to truncate all tables except profiles
const clearDatabaseSql = `
-- Truncate tables in the correct order to avoid foreign key constraint errors
TRUNCATE TABLE bookings CASCADE;
TRUNCATE TABLE tours CASCADE;
TRUNCATE TABLE events CASCADE;
TRUNCATE TABLE tour_categories CASCADE;
TRUNCATE TABLE event_types CASCADE;
TRUNCATE TABLE destinations CASCADE;
TRUNCATE TABLE admin_logs CASCADE;
TRUNCATE TABLE testimonials CASCADE;

-- Reset any sequence generators
ALTER SEQUENCE IF EXISTS tours_id_seq RESTART;
ALTER SEQUENCE IF EXISTS events_id_seq RESTART;
ALTER SEQUENCE IF EXISTS bookings_id_seq RESTART;
ALTER SEQUENCE IF EXISTS tour_categories_id_seq RESTART;
ALTER SEQUENCE IF EXISTS event_types_id_seq RESTART;
ALTER SEQUENCE IF EXISTS destinations_id_seq RESTART;
ALTER SEQUENCE IF EXISTS admin_logs_id_seq RESTART;
ALTER SEQUENCE IF EXISTS testimonials_id_seq RESTART;
`;

async function clearDatabase() {
  console.log('Starting database cleanup...');
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: clearDatabaseSql });
    
    if (error) {
      console.error('Error clearing database:', error);
      return;
    }
    
    console.log('Database cleared successfully!');
    console.log('All tables except profiles have been truncated.');
  } catch (error) {
    console.error('Error executing SQL:', error);
  }
}

clearDatabase(); 