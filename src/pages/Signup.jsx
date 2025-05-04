import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import getIcon from '../utils/iconUtils'

function Signup() {
  const { isInitialized } = useContext(AuthContext)
  const UserPlusIcon = getIcon('UserPlus')
  const MailIcon = getIcon('Mail')
  const LockIcon = getIcon('Lock')
  const UserIcon = getIcon('User')

  useEffect(() => {
    if (isInitialized) {
      // Show signup UI in this component
      const { ApperUI } = window.ApperSDK
      ApperUI.showSignup("#authentication")
    }
  }, [isInitialized])

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="w-full max-w-md p-6">
        <div className="card">
          <div className="card-header justify-center pb-6 pt-6 border-none">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 bg-primary/10 dark:bg-primary-dark/30 rounded-full flex items-center justify-center">
                  <UserPlusIcon className="w-8 h-8 text-primary dark:text-primary-light" />
                </div>
              </div>
              <h1 className="slds-text-heading_large text-brand-info dark:text-white">Create Account</h1>
              <p className="mt-2 text-surface-600 dark:text-surface-400">Sign up for your SpendSight account</p>
            </div>
          </div>
          
          <div className="card-body pt-0">
            <div id="authentication" className="min-h-[400px]">
              {/* Fallback signup form with SLDS styling */}
              <div className="space-y-4">
                <div className="slds-form-element">
                  <label htmlFor="fullname" className="slds-form-element__label">
                    Full Name
                  </label>
                  <div className="slds-input-has-icon">
                    <div className="slds-input-icon">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      id="fullname"
                      className="input"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
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
                      placeholder="Create a password"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    className="btn btn-primary w-full"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-footer text-center">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup