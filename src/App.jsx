import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
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

  const { isAuthenticated } = useSelector(state => state.user);

  return (
    <AuthProvider>
      <div className={isDarkMode ? 'dark' : ''}>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Dashboard isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? 
                <Login /> : 
                <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/signup" 
            element={
              !isAuthenticated ? 
                <Signup /> : 
                <Navigate to="/" replace />
            } 
          />
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