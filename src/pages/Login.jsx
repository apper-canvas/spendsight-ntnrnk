import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import getIcon from '../utils/iconUtils'

function Login() {
  // Safely access the AuthContext - it might be null during initial render
  const authContext = useContext(AuthContext)
  const isInitialized = authContext?.isInitialized
  const UserIcon = getIcon('User')
  const LockIcon = getIcon('Lock')
  const MailIcon = getIcon('Mail')

  // Authentication has been removed, so we don't need to initialize ApperUI
  // This prevents the error when trying to access window.ApperSDK

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="w-full max-w-md p-6">
        <div className="card">
          <div className="card-header justify-center pb-6 pt-6 border-none">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 bg-primary/10 dark:bg-primary-dark/30 rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-primary dark:text-primary-light" />
                </div>
              </div>
              <h1 className="slds-text-heading_large text-brand-info dark:text-white">Welcome Back</h1>
              <p className="mt-2 text-surface-600 dark:text-surface-400">Sign in to your account</p>
            </div>
          </div>
          
          <div className="card-body pt-0">
            {/* Simplified login form styled with SLDS */}
            <div className="space-y-4">
              <div className="slds-form-element">
                <label htmlFor="email" className="slds-form-element__label">
                  Email Address
                </label>
                <div className="slds-input-has-icon">
                  <div className="slds-input-icon">
                    <MailIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="input"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div className="slds-form-element">
                <label htmlFor="password" className="slds-form-element__label">
                  Password
                </label>
                <div className="slds-input-has-icon">
                  <div className="slds-input-icon">
                    <LockIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="input"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-surface-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs text-surface-700 dark:text-surface-300">
                    Remember me
                  </label>
                </div>
                <div className="text-xs">
                  <a href="#" className="text-primary hover:text-primary-dark">
                    Forgot your password?
                  </a>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  className="btn btn-primary w-full"
                  onClick={() => {
                    // Since auth is removed, just redirect to dashboard
                    window.location.href = '/'
                  }}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
          
          <div className="card-footer text-center">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login