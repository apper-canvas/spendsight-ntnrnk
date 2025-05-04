import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import getIcon from '../utils/iconUtils'

function Login() {
  // Safely access the AuthContext - it might be null during initial render
  const authContext = useContext(AuthContext)
  const isInitialized = authContext?.isInitialized
  const UserIcon = getIcon('User')

  // Authentication has been removed, so we don't need to initialize ApperUI
  // This prevents the error when trying to access window.ApperSDK

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="w-full max-w-md space-y-8 p-6 bg-white dark:bg-surface-800 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-primary/10 dark:bg-primary-dark/20 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-primary dark:text-primary-light" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-surface-800 dark:text-surface-100">Welcome Back</h1>
          <p className="mt-2 text-surface-600 dark:text-surface-400">Sign in to access your SpendSight account</p>
        </div>
        {/* Simplified login form since authentication has been removed */}
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-surface-700 dark:border-surface-600 dark:text-white"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-surface-700 dark:border-surface-600 dark:text-white"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <button
              type="button"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              onClick={() => {
                // Since auth is removed, just redirect to dashboard
                window.location.href = '/'
              }}
            >
              Sign In
            </button>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login