// Simple script to execute a migration using the exec_sql RPC function
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigration() {
  try {
    // Get migration file name from command line args
    const args = process.argv.slice(2);
    if (args.length === 0) {
      console.error('Please provide a migration file name');
      console.log('Usage: node runMigration.js <filename.sql>');
      process.exit(1);
    }

    const fileName = args[0];
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', fileName);
    
    // Check if file exists
    if (!fs.existsSync(migrationPath)) {
      console.error(`Migration file not found: ${migrationPath}`);
      process.exit(1);
    }
    
    // Read the SQL file
    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log(`Running migration: ${fileName}`);
    
    // Execute the SQL using RPC function
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('Error executing migration:', error);
      process.exit(1);
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Failed to run migration:', error);
    process.exit(1);
  }
}

runMigration();