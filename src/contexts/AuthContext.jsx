import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser, clearUser } from '../store/userSlice'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isInitialized, setIsInitialized] = useState(false)
  
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function(user) {
        if (user && user.isAuthenticated) {
          dispatch(setUser(user))
          navigate('/')
        } else {
          navigate('/login')
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error)
      }
    })
    
    setIsInitialized(true)
  }, [dispatch, navigate])
  
  const logout = async () => {
    try {
      const { ApperUI } = window.ApperSDK
      await ApperUI.logout()
      dispatch(clearUser())
      navigate('/login')
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }
  
  return (
    <AuthContext.Provider value={{ isInitialized, logout }}>
      {children}
    </AuthContext.Provider>
  )
}