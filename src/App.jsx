import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <AuthProvider>
      <div className={isDarkMode ? 'dark' : ''}>
        <Routes>
          {/* Allow direct access to the dashboard without authentication check */}
          <Route 
            path="/" 
            element={<Dashboard isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
          />
          {/* Allow direct access to login page without redirect */}
          <Route path="/login" element={<Login />} />
          {/* Allow direct access to signup page without redirect */}
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <div id="authentication" className="hidden"></div>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDarkMode ? 'dark' : 'light'}
        />
      </div>
    </AuthProvider>
  );
}

export default App;