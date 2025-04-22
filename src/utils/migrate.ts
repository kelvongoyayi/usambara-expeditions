import { supabase } from '../lib/supabase';
import fs from 'fs';
import path from 'path';

/**
 * Utility to run Supabase migrations from within the bolt.new environment
 */

/**
 * Execute a SQL migration string directly through the Supabase client
 */
async function executeSql(sql: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('Error executing migration SQL:', error);
      throw error;
    }
    
    console.log('SQL executed successfully');
  } catch (error) {
    console.error('Error running migration:', error);
    throw error;
  }
}

/**
 * Run a specific migration file
 */
export async function runMigration(fileName: string): Promise<void> {
  try {
    // Get the migration file path
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', fileName);
    
    // Read the migration file
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log(`Running migration: ${fileName}`);
    await executeSql(sql);
    console.log(`Migration ${fileName} completed successfully`);
  } catch (error) {
    console.error(`Failed to run migration ${fileName}:`, error);
    throw error;
  }
}

/**
 * List all available migration files
 */
export async function listMigrations(): Promise<string[]> {
  try {
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    const files = fs.readdirSync(migrationsDir);
    return files.filter(file => file.endsWith('.sql'));
  } catch (error) {
    console.error('Error listing migrations:', error);
    return [];
  }
}

/**
 * Main migration runner
 */
export async function runMigrations(specificFile?: string): Promise<void> {
  try {
    if (specificFile) {
      // Run specific migration
      await runMigration(specificFile);
    } else {
      // Run all migrations
      const migrations = await listMigrations();
      for (const migration of migrations) {
        await runMigration(migration);
      }
    }
  } catch (error) {
    console.error('Migration failed:', error);
  }
}