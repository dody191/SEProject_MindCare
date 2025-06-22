import { supabase } from './supabase'
import type { User, JournalEntry, Article, Bookmark, Psychologist, CounselingSession, ChatMessage } from './supabase'

// Test Supabase connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error) throw error
    console.log('Supabase connection successful:', data)
    return true
  } catch (error) {
    console.error('Supabase connection error:', error)
    return false
  }
}

// Authentication functions
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    console.log('Login successful:', data)
    return data
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Google login error:', error)
    throw error
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Get current user error:', error)
    throw error
  }
}

// User related functions
export async function getUser(userId: number) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data as User
  } catch (error) {
    console.error('Get user error:', error)
    throw error
  }
}

// Journal entries functions
export async function getJournalEntries(userId: number) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('entry_date', { ascending: false })
  
  if (error) throw error
  return data as JournalEntry[]
}

export async function createJournalEntry(entry: Omit<JournalEntry, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert(entry)
    .select()
    .single()
  
  if (error) throw error
  return data as JournalEntry
}

// Articles functions
export async function getArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('publish_date', { ascending: false })
  
  if (error) throw error
  return data as Article[]
}

// Bookmark functions
export async function getBookmarks(userId: number) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select(`
      *,
      articles (*)
    `)
    .eq('user_id', userId)
  
  if (error) throw error
  return data as (Bookmark & { articles: Article })[]
}

// Psychologist functions
export async function getPsychologists() {
  const { data, error } = await supabase
    .from('psychologists')
    .select('*')
    .order('rating', { ascending: false })
  
  if (error) throw error
  return data as Psychologist[]
}

// Counseling session functions
export async function createCounselingSession(session: Omit<CounselingSession, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('counseling_sessions')
    .insert(session)
    .select()
    .single()
  
  if (error) throw error
  return data as CounselingSession
}

// Chat message functions
export async function getChatMessages(sessionId: number) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('timestamp', { ascending: true })
  
  if (error) throw error
  return data as ChatMessage[]
}

export async function sendChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert(message)
    .select()
    .single()
  
  if (error) throw error
  return data as ChatMessage
} 