import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('products').update({ start_date: '2020-01-01' }).eq('name', 'TEST_NON_EXISTENT');
  console.log('Error:', error);
}

test();
