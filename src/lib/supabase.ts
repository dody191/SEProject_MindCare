import { createClient } from '@supabase/supabase-js'

// Ambil dari .env (Vite env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with explicit configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
});

// Test the connection immediately
async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    // Test with auth first
    const { data: authData, error: authError } = await supabase.auth.getSession()
    if (authError) {
      console.error('Auth test failed:', authError.message)
      console.error('Auth error details:', authError)
    } else {
      console.log('Auth connection successful')
    }

    // Then test database connection
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.error('Database connection test failed:', error.message)
      console.error('Error details:', error)
    } else {
      console.log('Database connection successful:', data)
    }
  } catch (error) {
    console.error('Connection test error:', error)
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
  }
}

// Run the test
testConnection()

// Type definitions for your database tables
export type User = {
  id: string
  name: string
  email: string
  age?: number
  gender?: string
  phone?: string
  purpose?: string
  created_at?: string
}

export type JournalEntry = {
  id: string
  user_id: string
  content: string
  mood: string
  created_at: string
}

export type Article = {
  id: string
  title: string
  content: string
  author: string
  created_at: string
}

export type Bookmark = {
  id: string
  user_id: string
  article_id: string
  created_at: string
}

export type Psychologist = {
  id: string
  name: string
  specialization: string
  experience: number
  rating: number
  created_at: string
}

export type CounselingSession = {
  id: string
  user_id: string
  psychologist_id: string
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  scheduled_at: string
  created_at: string
}

export type ChatMessage = {
  id: string
  session_id: string
  sender_id: string
  content: string
  created_at: string
} 