import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, subMonths, startOfYear, isSameMonth, isSameYear } from 'date-fns';
import { useSelector } from 'react-redux';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import { fetchExpenses, deleteExpense } from '../services/expenseService';
import { AuthContext } from '../contexts/AuthContext';

function Dashboard({ isDarkMode, toggleDarkMode }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState('dashboard');
  
  const { user } = useSelector(state => state.user);
  const { logout } = useContext(AuthContext);
  
  // Icons
  const HomeIcon = getIcon('LayoutDashboard');
  const PlusIcon = getIcon('Plus');
  const SunIcon = getIcon('Sun');
  const MoonIcon = getIcon('Moon');
  const AnalyticsIcon = getIcon('BarChart');
  const HistoryIcon = getIcon('Clock');
  const SettingsIcon = getIcon('Settings');
  const LogOutIcon = getIcon('LogOut');
  const FilterIcon = getIcon('Filter');
  const CloseIcon = getIcon('X');
  
  useEffect(() => {
    const loadExpenses = async () => {
      setIsLoading(true);
      try {
        const response = await fetchExpenses();
        // Make sure to extract the data array from the response
        setExpenses(response.data || []);
      } catch (error) {
        console.error("Failed to load expenses:", error);
        toast.error("Failed to load expenses");
        setExpenses([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExpenses();
  }, []);
  
  const addExpense = (newExpense) => {
    setExpenses(prev => [newExpense, ...prev]);
    toast.success("Expense added successfully!");
  };
  
  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      toast.info("Expense deleted");
    } catch (error) {
      console.error("Failed to delete expense:", error);
      toast.error("Failed to delete expense");
    }
  };
  
  // Analytics calculations
  const calculateTotals = () => {
    const now = new Date();
    const threeMonthsAgo = subMonths(now, 3);
    const startOfThisYear = startOfYear(now);
    const lastYear = subMonths(now, 12);
    
    // Ensure expenses is an array before using reduce
    const expensesArray = Array.isArray(expenses) ? expenses : [];
    
    const totalThisYear = expensesArray.reduce((acc, expense) => {
      const expenseDate = new Date(expense.date);
      return isSameYear(expenseDate, now) ? acc + expense.amount : acc;
    }, 0);
    
    const totalLast3Months = expensesArray.reduce((acc, expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= threeMonthsAgo ? acc + expense.amount : acc;
    }, 0);
    
    const totalLastYear = expensesArray.reduce((acc, expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= lastYear && expenseDate < startOfThisYear 
        ? acc + expense.amount : acc;
    }, 0);
    
    const thisMonthLastYear = expensesArray.reduce((acc, expense) => {
      const expenseDate = new Date(expense.date);
      const lastYearSameMonth = new Date(now.getFullYear() - 1, now.getMonth());
      return isSameMonth(expenseDate, lastYearSameMonth) ? acc + expense.amount : acc;
    }, 0);
    
    return {
      thisYear: totalThisYear,
      last3Months: totalLast3Months,
      lastYear: totalLastYear,
      thisMonthLastYear
    };
  };
  
  const totals = calculateTotals();
  
  // Get category breakdown
  const getCategoryBreakdown = () => {
    // Ensure expenses is an array before using reduce
    const expensesArray = Array.isArray(expenses) ? expenses : [];
    
    return expensesArray.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = {
          total: 0,
          count: 0
        };
      }
      acc[expense.category].total += expense.amount;
      acc[expense.category].count += 1;
      return acc;
    }, {});
  };
  
  const categoryBreakdown = getCategoryBreakdown();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-2xs text-surface-600 dark:text-surface-300">Loading SpendSight...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900">
      {/* Compact Header */}
      <header className="bg-white dark:bg-surface-800 shadow-sm border-b border-surface-200 dark:border-surface-700">
        <div className="max-w-7xl mx-auto px-2 h-10 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary inline-block text-transparent bg-clip-text">
              SpendSight
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            {user && (
              <div className="text-2xs font-medium text-surface-700 dark:text-surface-300 mr-1">
                {user.firstName || 'User'}
              </div>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <SunIcon className="w-3 h-3" /> : <MoonIcon className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Mobile Bottom Nav / Desktop Side Nav */}
        <nav className="fixed bottom-0 left-0 right-0 md:relative md:w-12 lg:w-36 bg-white dark:bg-surface-800 border-t md:border-r border-surface-200 dark:border-surface-700 z-10 h-12 md:h-auto">
          <div className="md:sticky md:top-0 md:h-screen">
            <div className="h-8 md:h-10 flex md:justify-center md:items-center md:border-b border-surface-200 dark:border-surface-700 hidden md:flex">
              <span className="text-sm font-bold hidden lg:flex bg-gradient-to-r from-primary to-secondary inline-block text-transparent bg-clip-text">
                SpendSight
              </span>
              <span className="lg:hidden">
                <AnalyticsIcon className="w-4 h-4 text-primary" />
              </span>
            </div>
            
            <div className="flex md:flex-col justify-around md:justify-start md:space-y-0.5 md:mt-1 md:px-1 h-full md:h-auto">
              <button
                onClick={() => setSelectedPage('dashboard')}
                className={`flex items-center justify-center md:justify-start px-0.5 py-1 rounded-md md:rounded-lg transition-colors
                          ${selectedPage === 'dashboard' ? 
                            'text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-dark/20' : 
                            'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
              >
                <HomeIcon className="w-4 h-4 shrink-0" />
                <span className="sr-only md:not-sr-only ml-1 font-medium tracking-wide hidden lg:block text-2xs">Dashboard</span>
              </button>
              
              <button
                onClick={() => setSelectedPage('add')}
                className={`flex items-center justify-center md:justify-start px-0.5 py-1 rounded-md md:rounded-lg transition-colors
                          ${selectedPage === 'add' ? 
                            'text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-dark/20' : 
                            'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
              >
                <PlusIcon className="w-4 h-4 shrink-0" />
                <span className="sr-only md:not-sr-only ml-1 font-medium tracking-wide hidden lg:block text-2xs">Add Expense</span>
              </button>
              
              <button
                onClick={() => setSelectedPage('history')}
                className={`flex items-center justify-center md:justify-start px-0.5 py-1 rounded-md md:rounded-lg transition-colors
                          ${selectedPage === 'history' ? 
                            'text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-dark/20' : 
                            'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
              >
                <HistoryIcon className="w-4 h-4 shrink-0" />
                <span className="sr-only md:not-sr-only ml-1 font-medium tracking-wide hidden lg:block text-2xs">History</span>
              </button>
              
              <button
                onClick={() => setSelectedPage('settings')}
                className={`flex items-center justify-center md:justify-start px-0.5 py-1 rounded-md md:rounded-lg transition-colors
                          ${selectedPage === 'settings' ? 
                            'text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-dark/20' : 
                            'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
              >
                <SettingsIcon className="w-4 h-4 shrink-0" />
                <span className="sr-only md:not-sr-only ml-1 font-medium tracking-wide hidden lg:block text-2xs">Settings</span>
              </button>

              <div className="hidden md:block md:mt-auto md:mb-2">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center md:justify-start px-0.5 py-1 rounded-md md:rounded-lg transition-colors
                            text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <LogOutIcon className="w-4 h-4 shrink-0" />
                  <span className="sr-only md:not-sr-only ml-1 font-medium tracking-wide hidden lg:block text-2xs">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Main content area */}
        <main className="flex-1 py-2 px-2 mb-12 md:mb-0">
          {selectedPage === 'dashboard' && (
            <div className="space-y-2">
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <h1 className="text-base font-bold text-surface-900 dark:text-white px-1">
                  Expense Dashboard
                </h1>

                <div className="grid grid-cols-2 gap-2">
                  <div className="card p-2 flex flex-col">
                    <h3 className="text-2xs font-medium text-surface-500 dark:text-surface-400">This Year Total</h3>
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">
                      ₹{totals.thisYear.toFixed(0)}
                    </p>
                    <div className="text-2xs text-surface-600 dark:text-surface-400">
                      {totals.thisYear > totals.lastYear ? 
                        <span className="text-red-500 dark:text-red-400 flex items-center text-2xs">
                          <span className="inline-block mr-0.5">↑</span> 
                          {((totals.thisYear - totals.lastYear) / (totals.lastYear || 1) * 100).toFixed(0)}% vs last yr
                        </span> : 
                        <span className="text-green-500 dark:text-green-400 flex items-center text-2xs">
                          <span className="inline-block mr-0.5">↓</span> 
                          {((totals.lastYear - totals.thisYear) / (totals.lastYear || 1) * 100).toFixed(0)}% vs last yr
                        </span>
                      }
                    </div>
                  </div>
                  
                  <div className="card p-2 flex flex-col">
                    <h3 className="text-2xs font-medium text-surface-500 dark:text-surface-400">Last 3 Months</h3>
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">
                      ₹{totals.last3Months.toFixed(0)}
                    </p>
                    <div className="text-2xs text-surface-600 dark:text-surface-400">
                      {expenses.length > 0 ? 
                        `${Math.round(totals.last3Months / totals.thisYear * 100)}% of yearly` : 
                        'No expenses yet'}
                    </div>
                  </div>
                  
                  <div className="card p-2 flex flex-col">
                    <h3 className="text-2xs font-medium text-surface-500 dark:text-surface-400">This Month Last Year</h3>
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">
                      ₹{totals.thisMonthLastYear.toFixed(0)}
                    </p>
                    <div className="text-2xs text-surface-600 dark:text-surface-400">
                      {format(new Date(), 'MMM yyyy')}
                    </div>
                  </div>
                  
                  <div className="card p-2 flex flex-col">
                    <h3 className="text-2xs font-medium text-surface-500 dark:text-surface-400">Total Expenses</h3>
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">
                      {expenses.length}
                    </p>
                    <div className="text-2xs text-surface-600 dark:text-surface-400">
                      {Object.keys(categoryBreakdown).length} categories
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 gap-2"
              >
                <div className="card p-2">
                  <h2 className="text-2xs font-semibold text-surface-900 dark:text-white mb-1.5">Top Categories</h2>
                  
                  {Object.keys(categoryBreakdown).length > 0 ? (
                    <div className="space-y-1.5">
                      {Object.entries(categoryBreakdown)
                        .sort((a, b) => b[1].total - a[1].total)
                        .slice(0, 4)
                        .map(([category, data]) => (
                          <div key={category} className="flex items-center">
                            <div className="w-1/2">
                              <h4 className="text-2xs font-medium text-surface-700 dark:text-surface-300 truncate">
                                {category}
                              </h4>
                              <p className="text-2xs text-surface-500 dark:text-surface-400">
                                {data.count} exp.
                              </p>
                            </div>
                            <div className="w-1/2 space-y-0.5">
                              <div className="flex justify-between text-2xs">
                                <span className="font-medium text-surface-800 dark:text-surface-200">
                                  ₹{data.total.toFixed(0)}
                                </span>
                                <span className="text-surface-500 dark:text-surface-400">
                                  {Math.round((data.total / totals.thisYear) * 100)}%
                                </span>
                              </div>
                              <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-0.5">
                                <div
                                  className="bg-primary h-0.5 rounded-full"
                                  style={{ width: `${Math.min(100, Math.round((data.total / totals.thisYear) * 100))}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="h-24 flex items-center justify-center">
                      <div className="text-center space-y-1">
                        <p className="text-2xs text-surface-600 dark:text-surface-400">No categories yet</p>
                        <p className="text-2xs text-surface-500 dark:text-surface-400">
                          Add expenses to see breakdown
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <div className="px-2 py-1.5 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
                  <h2 className="text-2xs font-semibold text-surface-900 dark:text-white">Recent Expenses</h2>
                  
                  {expenses.length > 2 && (
                    <button
                      onClick={() => setSelectedPage('history')}
                      className="text-primary dark:text-primary-light text-2xs font-medium"
                    >
                      View all
                    </button>
                  )}
                </div>
                
                {expenses.length > 0 ? (
                  <div className="p-0.5">
                    {expenses.slice(0, 4).map((expense) => (
                      <div key={expense.id} className="p-1.5 border-b border-surface-100 dark:border-surface-800 last:border-0 flex justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start">
                            <div className="rounded-full w-5 h-5 bg-primary/10 flex items-center justify-center mr-1.5">
                              <span className="text-2xs text-primary">₹</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-surface-900 dark:text-white truncate">
                                {expense.description}
                              </p>
                              <div className="flex items-center mt-0.5">
                                <span className="text-2xs text-surface-500 dark:text-surface-400 mr-1.5">
                                  {format(new Date(expense.date), 'dd MMM')}
                                </span>
                                <span className="text-2xs py-px px-1 rounded-full bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light truncate max-w-24">
                                  {expense.category.length > 15 ? expense.category.substring(0, 15) + '...' : expense.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end ml-2">
                          <span className="text-xs font-semibold text-surface-900 dark:text-white whitespace-nowrap">
                            ₹{expense.amount.toFixed(0)}
                          </span>
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-2xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 mt-0.5"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-3 px-2 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center mb-2">
                      <AnalyticsIcon className="w-4 h-4 text-surface-400 dark:text-surface-500" />
                    </div>
                    <h3 className="text-xs font-medium text-surface-900 dark:text-white mb-0.5">
                      No expenses yet
                    </h3>
                    <p className="text-2xs text-surface-600 dark:text-surface-400 mb-2 max-w-xs">
                      Start tracking your spending by adding your first expense.
                    </p>
                    <button
                      onClick={() => setSelectedPage('add')}
                      className="btn-compact btn-primary inline-flex items-center text-2xs"
                    >
                      <PlusIcon className="w-3 h-3 mr-1" />
                      Add Expense
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
          
          {selectedPage === 'add' && (
            <div className="space-y-2">
              <h1 className="text-base font-bold text-surface-900 dark:text-white px-1">
                Add New Expense
              </h1>
              
              <MainFeature onAddExpense={addExpense} />
            </div>
          )}
          
          {selectedPage === 'history' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <h1 className="text-base font-bold text-surface-900 dark:text-white">
                  Expense History
                </h1>
                <button className="p-1 rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">
                  <FilterIcon className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {expenses.length > 0 ? (
                <div className="card">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="p-1.5 border-b border-surface-100 dark:border-surface-800 last:border-0 flex justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start">
                          <div className="rounded-full w-5 h-5 bg-primary/10 flex items-center justify-center mr-1.5">
                            <span className="text-2xs text-primary">₹</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-surface-900 dark:text-white truncate">
                              {expense.description}
                            </p>
                            <div className="flex items-center mt-0.5">
                              <span className="text-2xs text-surface-500 dark:text-surface-400 mr-1.5">
                                {format(new Date(expense.date), 'dd MMM yyyy')}
                              </span>
                              <span className="text-2xs py-px px-1 rounded-full bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light truncate max-w-24">
                                {expense.category.length > 15 ? expense.category.substring(0, 15) + '...' : expense.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end ml-2">
                        <span className="text-xs font-semibold text-surface-900 dark:text-white whitespace-nowrap">
                          ₹{expense.amount.toFixed(0)}
                        </span>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-2xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 mt-0.5"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 card p-3 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center mb-2">
                    <HistoryIcon className="w-4 h-4 text-surface-400 dark:text-surface-500" />
                  </div>
                  <h3 className="text-xs font-medium text-surface-900 dark:text-white mb-0.5">
                    No expense history
                  </h3>
                  <p className="text-2xs text-surface-600 dark:text-surface-400 mb-2 max-w-xs">
                    Your expense history will appear here once you start adding expenses.
                  </p>
                  <button
                    onClick={() => setSelectedPage('add')}
                    className="btn-compact btn-primary inline-flex items-center text-2xs"
                  >
                    <PlusIcon className="w-3 h-3 mr-1" />
                    Add First Expense
                  </button>
                </div>
              )}
            </div>
          )}
          
          {selectedPage === 'settings' && (
            <div className="space-y-2">
              <h1 className="text-base font-bold text-surface-900 dark:text-white px-1">
                Settings
              </h1>
              
              <div className="card p-3 space-y-3">
                <div>
                  <h3 className="text-xs font-medium text-surface-900 dark:text-white mb-1.5">
                    Appearance
                  </h3>
                  <div className="flex items-center">
                    <button
                      onClick={toggleDarkMode}
                      className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 ${
                        isDarkMode ? 'bg-primary' : 'bg-surface-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          isDarkMode ? 'translate-x-3.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    <span className="ml-2 text-2xs font-medium text-surface-700 dark:text-surface-300">
                      {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xs font-medium text-surface-900 dark:text-white mb-1.5">
                    Account
                  </h3>
                  <button
                    onClick={logout}
                    className="btn-compact btn-outline text-red-500 dark:text-red-400 border-red-300 dark:border-red-800/30 hover:bg-red-50 dark:hover:bg-red-900/20 text-2xs"
                  >
                    Logout
                  </button>
                </div>
                
                <div>
                  <h3 className="text-xs font-medium text-surface-900 dark:text-white mb-1.5">
                    About
                  </h3>
                  <div className="text-2xs text-surface-600 dark:text-surface-400">
                    <p>SpendSight v1.0.0</p>
                    <p className="mt-0.5">A personal expense tracking application</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;