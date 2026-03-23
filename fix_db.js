const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const sb = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function fixDb() {
  console.log('Running query...');
  const res1 = await sb.rpc('exec_sql', {
    query: `
      ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS delivery_preference TEXT;
      NOTIFY pgrst, 'reload schema';
    `
  });
  console.log('RPC result:', res1);

  // Check if offers table schema has it now
  const check = await sb.from('offers').select('delivery_preference').limit(1);
  console.log('Check delivery_preference:', check.error || 'Exists');
}

fixDb();
