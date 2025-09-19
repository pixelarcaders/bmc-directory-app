import { createClient } from '@supabase/supabase-js';

// Use environment variables for configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vmypewnwlyfnxxkhhisk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZteXBld253bHlmbnh4a2hoaXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODQ0OTIsImV4cCI6MjA3MTM2MDQ5Mn0.NmNR0RyqdmORJ_KKfGT5LbxmDx7O0wcJZvksVRInZms';

console.log('🔧 Supabase Configuration:');
console.log('URL:', supabaseUrl);
console.log('Key configured:', supabaseAnonKey ? '✅ Yes' : '❌ No');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing!');
  throw new Error('Supabase is not configured. Please set up environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection immediately
const testConnection = async () => {
  try {
    console.log('🔄 Testing Supabase connection...');
    const { data, error } = await supabase.from('businesses').select('*').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      if (error.message.includes('relation "businesses" does not exist')) {
        console.error('💡 Solution: Create the businesses table in your Supabase dashboard');
      } else {
        console.error('💡 Error details:', error.message);
      }
    } else {
      console.log('✅ Supabase connection successful!');
      console.log('📊 Businesses table exists and is accessible');
      console.log('📝 Current data count:', data?.length || 0);
    }
  } catch (err) {
    console.error('❌ Supabase connection error:', err);
  }
};

// Test connection on load
testConnection();

// Helper function for safe single row queries
export const safeSingleQuery = async (query: any) => {
  try {
    const { data, error } = await query.maybeSingle();
    return { data, error };
  } catch (err) {
    console.error('Query error:', err);
    return { data: null, error: err };
  }
};
export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          business_name: string;
          owner_name: string;
          business_description: string;
          website_url: string | null;
          business_category: string;
          certifications: string[];
          logo_url: string | null;
          contact_email: string;
          contact_phone: string | null;
          business_address: string;
          social_media: Record<string, any>;
          created_at: string;
          status: 'pending' | 'approved' | 'rejected';
          is_featured: boolean;
          admin_notes: string | null;
          rejection_reason: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_name: string;
          owner_name: string;
          business_description: string;
          website_url?: string | null;
          business_category: string;
          certifications?: string[];
          logo_url?: string | null;
          contact_email: string;
          contact_phone?: string | null;
          business_address: string;
          social_media?: Record<string, any>;
          created_at?: string;
          status?: 'pending' | 'approved' | 'rejected';
          is_featured?: boolean;
          admin_notes?: string | null;
          rejection_reason?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_name?: string;
          owner_name?: string;
          business_description?: string;
          website_url?: string | null;
          business_category?: string;
          certifications?: string[];
          logo_url?: string | null;
          contact_email?: string;
          contact_phone?: string | null;
          business_address?: string;
          social_media?: Record<string, any>;
          created_at?: string;
          status?: 'pending' | 'approved' | 'rejected';
          is_featured?: boolean;
          admin_notes?: string | null;
          rejection_reason?: string | null;
          updated_at?: string;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          status: 'active' | 'unsubscribed';
          subscribed_at: string;
          unsubscribed_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          status?: 'active' | 'unsubscribed';
          subscribed_at?: string;
          unsubscribed_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          status?: 'active' | 'unsubscribed';
          subscribed_at?: string;
          unsubscribed_at?: string | null;
        };
      };
    };
  };
};