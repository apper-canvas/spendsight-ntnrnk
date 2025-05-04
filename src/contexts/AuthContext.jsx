import { createContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/userSlice'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const dispatch = useDispatch()
  const [isInitialized, setIsInitialized] = useState(true)

  // Simplified authContext that doesn't enforce authentication
  // No ApperUI initialization or automatic redirects
  const contextValue = {
    isInitialized,
    // Keep simplified logout function for any components that might still use it
    logout: () => {
      console.log("Authentication has been removed, logout is a no-op")
    }
  }
  
  // Set a default user to ensure isAuthenticated is true in the Redux store
  // This prevents any remaining auth checks from redirecting
  useState(() => {
    dispatch(setUser({ 
      isAuthenticated: true,
      name: 'Guest User',
      email: 'guest@example.com'
    }))
  }, [])
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}