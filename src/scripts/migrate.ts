import { supabase } from '../lib/supabase';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function runMigration(fileName: string): Promise<void> {
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

async function listMigrations(): Promise<string[]> {
  try {
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    const files = fs.readdirSync(migrationsDir);
    return files.filter(file => file.endsWith('.sql'));
  } catch (error) {
    console.error('Error listing migrations:', error);
    return [];
  }
}

async function runMigrations(specificFile?: string): Promise<void> {
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

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const fileName = args[1];

  switch (command) {
    case 'list':
      console.log('Available migrations:');
      const migrations = await listMigrations();
      migrations.forEach((file, index) => {
        console.log(`${index + 1}. ${file}`);
      });
      break;
    
    case 'run':
      if (fileName) {
        await runMigrations(fileName);
      } else {
        console.log('Running all migrations');
        await runMigrations();
      }
      break;
    
    default:
      console.log(`
Migration Runner Usage:
  node migrate.ts list             - List all available migrations
  node migrate.ts run              - Run all migrations
  node migrate.ts run [filename]   - Run a specific migration
      `);
      break;
  }
}

main().catch(console.error);