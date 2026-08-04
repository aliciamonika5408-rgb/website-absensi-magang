import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://lposgjfykvrfqrotbjcm.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_vRx7BGogVx0iE89ltN_ykA_jWMVWPuK";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
