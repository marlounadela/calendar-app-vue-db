import { config } from '@vue/test-utils'

// Global test configuration
config.global.stubs = {
  // Stub external components if needed
}

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_SUPABASE_URL: 'https://test.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'test-key',
  },
})
