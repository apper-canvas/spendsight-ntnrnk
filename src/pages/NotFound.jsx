import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function NotFound({ isDarkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const NotFoundIcon = getIcon('FileQuestion');

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900 text-surface-800 dark:text-surface-100">
      <header className="w-full h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between bg-white dark:bg-surface-800 shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back Home</span>
          </button>
        </div>
        
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full mx-auto text-center"
        >
          <div className="mb-8 inline-flex p-4 rounded-full bg-primary/10 dark:bg-primary/20">
            <NotFoundIcon className="w-12 h-12 text-primary dark:text-primary-light" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4 text-surface-900 dark:text-surface-50">
            Page Not Found
          </h1>
          
          <p className="text-surface-600 dark:text-surface-300 mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
            className="btn btn-primary w-full sm:w-auto px-8 py-3"
          >
            Return to Dashboard
          </motion.button>
        </motion.div>
      </main>
      
      <footer className="p-4 text-center text-surface-500 dark:text-surface-400 text-sm">
        <p>© {new Date().getFullYear()} SpendSight. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default NotFound;