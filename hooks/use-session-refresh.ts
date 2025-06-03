import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function useSessionRefresh() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Check if we just came from an auth page by checking sessionStorage
    const justAuthenticated = sessionStorage.getItem('justAuthenticated')
    
    if (justAuthenticated && status !== 'loading') {
      // Clear the flag
      sessionStorage.removeItem('justAuthenticated')
      
      // Force session update
      update().then(() => {
        // Also refresh the router to ensure all server components are updated
        router.refresh()
      })
    }
  }, [status, update, router])

  // Handle visibility change (when user comes back to the tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && status !== 'loading') {
        update()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [status, update])

  return { session, status, update }
}

// Helper function to mark that authentication just happened
export function markJustAuthenticated() {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('justAuthenticated', 'true')
  }
} 