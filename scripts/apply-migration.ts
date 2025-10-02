import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('Applying database migration...');

  const migrationPath = path.join(process.cwd(), 'supabase/migrations/20250102000001_initial_schema.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  // Split by semicolons and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('/*') && !s.startsWith('--'));

  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
      if (error) {
        console.error('Error executing statement:', error);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }

  console.log('Migration completed!');
}

applyMigration();
