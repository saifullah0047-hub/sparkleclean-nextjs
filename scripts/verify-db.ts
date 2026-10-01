import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config({path: '.env'});

async function verify() {
  const sql = neon(process.env.DATABASE_URL!);
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
  console.log('Tables:', tables.map(t => t.table_name).join(', '));
  for (const t of tables) {
    const result = await sql.query(`SELECT count(*) as count FROM ${t.table_name}`);
    console.log(`  ${t.table_name}: ${result[0].count} rows`);
  }
}

verify().catch(console.error);