import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Check if Supabase is properly configured
const isSupabaseConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your_supabase_project_url_here' &&
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 50

// Local storage helper functions
const STORAGE_KEY = 'calendar_events'

const getStoredEvents = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }

    // Initialize with sample data if no events exist
    const sampleEvents = [
      {
        id: '1',
        title: 'Welcome to Calendar App',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
        color: '#3788d8',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Sample Event Tomorrow',
        start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
        color: '#28a745',
        created_at: new Date().toISOString(),
      },
    ]

    storeEvents(sampleEvents)
    return sampleEvents
  } catch {
    return []
  }
}

const storeEvents = (events: any[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch (error) {
    console.warn('Failed to save events to local storage:', error)
  }
}

// Create a local storage client if Supabase is not configured
const createLocalStorageClient = () => ({
  from: (_table: string) => ({
    select: (_columns = '*') => {
      const events = getStoredEvents()
      return {
        order: (field: string, options: { ascending: boolean }) => {
          const sortedEvents = [...events].sort((a: any, b: any) => {
            const aValue = a[field]
            const bValue = b[field]
            if (aValue < bValue) return options.ascending ? -1 : 1
            if (aValue > bValue) return options.ascending ? 1 : -1
            return 0
          })
          return Promise.resolve({ data: sortedEvents, error: null })
        },
        eq: (field: string, value: any) => {
          const events = getStoredEvents()
          const filteredEvents = events.filter((e: any) => e[field] === value)
          return Promise.resolve({ data: filteredEvents, error: null })
        },
        single: () => {
          const events = getStoredEvents()
          return Promise.resolve({ data: events[0] || null, error: null })
        },
      }
    },
    insert: (data: any) => ({
      select: () => ({
        single: () => {
          const events = getStoredEvents()
          const newEvent = {
            id: Date.now().toString(),
            ...data,
            created_at: new Date().toISOString(),
          }
          events.push(newEvent)
          storeEvents(events)
          return Promise.resolve({ data: newEvent, error: null })
        },
      }),
    }),
    update: (data: any) => ({
      eq: (field: string, value: any) => ({
        select: () => ({
          single: () => {
            const events = getStoredEvents()
            const index = events.findIndex((e: any) => e[field] === value)
            if (index !== -1) {
              events[index] = { ...events[index], ...data }
              storeEvents(events)
              return Promise.resolve({ data: events[index], error: null })
            }
            return Promise.resolve({ data: null, error: { message: 'Event not found' } })
          },
        }),
      }),
    }),
    delete: () => ({
      eq: (field: string, value: any) => {
        const events = getStoredEvents()
        const filteredEvents = events.filter((e: any) => e[field] !== value)
        storeEvents(filteredEvents)
        return Promise.resolve({ error: null })
      },
    }),
  }),
})

// Create Supabase client with proper error handling and production optimizations
let supabaseClient: SupabaseClient | ReturnType<typeof createLocalStorageClient>

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Disable session persistence for better performance
        autoRefreshToken: false, // Disable auto refresh for anonymous usage
        detectSessionInUrl: false, // Disable URL session detection
      },
      realtime: {
        enabled: false, // Disable realtime for better performance
      },
      global: {
        headers: {
          'X-Client-Info': 'vue-calendar-app',
        },
      },
    })

    // Test connection in development
    if (import.meta.env.DEV) {
      console.log('✅ Supabase client initialized successfully')
      // Test the connection
      supabaseClient
        .from('events')
        .select('count')
        .limit(1)
        .then(({ error }) => {
          if (error) {
            console.warn('⚠️ Supabase connection test failed:', error.message)
          } else {
            console.log('✅ Supabase connection test successful')
          }
        })
        .catch(() => {
          console.warn('⚠️ Supabase connection test failed')
        })
    }
  } catch (error) {
    console.warn('❌ Failed to initialize Supabase client:', error)
    supabaseClient = createLocalStorageClient()
  }
} else {
  if (import.meta.env.DEV) {
    console.warn('⚠️ Supabase not configured. Using local storage fallback.')
    console.log('To enable Supabase:')
    console.log('1. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables')
    console.log('2. Run the database-setup.sql script in your Supabase project')
  }
  supabaseClient = createLocalStorageClient()
}

export const supabase = supabaseClient
