// supabase-config.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ecwwruovdowlqdtvktaz.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Ensure this is set up in your environment variables
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
