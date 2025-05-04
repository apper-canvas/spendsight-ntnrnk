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
  
  useEffect(() => {
    const loadExpenses = async () => {
      setIsLoading(true);
      try {
        const data = await fetchExpenses();
        setExpenses(data);
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
    
    const totalThisYear = expenses.reduce((acc, expense) => {
      const expenseDate = new Date(expense.date);
      return isSameYear(expenseDate, now) ? acc + expense.amount : acc;
    }, 0);
    
    const totalLast3Months = expenses.reduce((acc, expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= threeMonthsAgo ? acc + expense.amount : acc;
    }, 0);
    
    const totalLastYear = expenses.reduce((acc, expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= lastYear && expenseDate < startOfThisYear 
        ? acc + expense.amount : acc;
    }, 0);
    
    const thisMonthLastYear = expenses.reduce((acc, expense) => {
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
    return expenses.reduce((acc, expense) => {
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
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-surface-600 dark:text-surface-300">Loading SpendSight...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900">
      {/* Header */}
      <header className="bg-white dark:bg-surface-800 shadow-sm border-b border-surface-200 dark:border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary inline-block text-transparent bg-clip-text">
              SpendSight
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            {user && (
              <div className="text-sm font-medium text-surface-700 dark:text-surface-300 mr-3">
                {user.firstName || 'User'}
              </div>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar / Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 md:relative md:w-20 lg:w-64 bg-white dark:bg-surface-800 border-t md:border-r border-surface-200 dark:border-surface-700 z-10">
          <div className="md:sticky md:top-0 md:h-screen">
            <div className="h-16 md:h-16 flex md:justify-center md:items-center md:border-b border-surface-200 dark:border-surface-700 hidden md:flex">
              <span className="text-xl font-bold hidden lg:flex bg-gradient-to-r from-primary to-secondary inline-block text-transparent bg-clip-text">
                SpendSight
              </span>
              <span className="lg:hidden">
                <AnalyticsIcon className="w-8 h-8 text-primary" />
              </span>
            </div>
            
            <div className="flex md:flex-col justify-around md:justify-start md:space-y-1 md:mt-4 md:px-2">
              <button
                onClick={() => setSelectedPage('dashboard')}
                className={`flex items-center justify-center md:justify-start px-2 py-3 rounded-md md:rounded-lg transition-colors
                          ${selectedPage === 'dashboard' ? 
                            'text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-dark/20' : 
                            'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
              >
                <HomeIcon className="w-6 h-6 shrink-0" />
                <span className="sr-only md:not-sr-only ml-3 font-medium tracking-wide hidden lg:block">Dashboard</span>
              </button>
              
              <button
                onClick={() => setSelectedPage('add')}
                className={`flex items-center justify-center md:justify-start px-2 py-3 rounded-md md:rounded-lg transition-colors
                          ${selectedPage === 'add' ? 
                            'text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-dark/20' : 
                            'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
              >
                <PlusIcon className="w-6 h-6 shrink-0" />
                <span className="sr-only md:not-sr-only ml-3 font-medium tracking-wide hidden lg:block">Add Expense</span>
              </button>
              
              <button
                onClick={() => setSelectedPage('history')}
                className={`flex items-center justify-center md:justify-start px-2 py-3 rounded-md md:rounded-lg transition-colors
                          ${selectedPage === 'history' ? 
                            'text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-dark/20' : 
                            'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
              >
                <HistoryIcon className="w-6 h-6 shrink-0" />
                <span className="sr-only md:not-sr-only ml-3 font-medium tracking-wide hidden lg:block">History</span>
              </button>
              
              <button
                onClick={() => setSelectedPage('settings')}
                className={`flex items-center justify-center md:justify-start px-2 py-3 rounded-md md:rounded-lg transition-colors
                          ${selectedPage === 'settings' ? 
                            'text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-dark/20' : 
                            'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
              >
                <SettingsIcon className="w-6 h-6 shrink-0" />
                <span className="sr-only md:not-sr-only ml-3 font-medium tracking-wide hidden lg:block">Settings</span>
              </button>

              <div className="hidden md:block md:mt-auto md:mb-4">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center md:justify-start px-2 py-3 rounded-md md:rounded-lg transition-colors
                            text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <LogOutIcon className="w-6 h-6 shrink-0" />
                  <span className="sr-only md:not-sr-only ml-3 font-medium tracking-wide hidden lg:block">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Main content area */}
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 mb-16 md:mb-0">
          {selectedPage === 'dashboard' && (
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
                  Expense Dashboard
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="card p-4 flex flex-col">
                    <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400">This Year Total</h3>
                    <p className="mt-1 text-2xl font-semibold text-surface-900 dark:text-white">
                      ₹{totals.thisYear.toFixed(2)}
                    </p>
                    <div className="mt-2 text-xs text-surface-600 dark:text-surface-400">
                      {totals.thisYear > totals.lastYear ? 
                        <span className="text-red-500 dark:text-red-400 flex items-center">
                          <span className="inline-block mr-1">↑</span> 
                          {((totals.thisYear - totals.lastYear) / (totals.lastYear || 1) * 100).toFixed(0)}% from last year
                        </span> : 
                        <span className="text-green-500 dark:text-green-400 flex items-center">
                          <span className="inline-block mr-1">↓</span> 
                          {((totals.lastYear - totals.thisYear) / (totals.lastYear || 1) * 100).toFixed(0)}% from last year
                        </span>
                      }
                    </div>
                  </div>
                  
                  <div className="card p-4 flex flex-col">
                    <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400">Last 3 Months</h3>
                    <p className="mt-1 text-2xl font-semibold text-surface-900 dark:text-white">
                      ₹{totals.last3Months.toFixed(2)}
                    </p>
                    <div className="mt-2 text-xs text-surface-600 dark:text-surface-400">
                      {expenses.length > 0 ? 
                        `${Math.round(totals.last3Months / totals.thisYear * 100)}% of yearly spending` : 
                        'No expenses recorded yet'}
                    </div>
                  </div>
                  
                  <div className="card p-4 flex flex-col">
                    <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400">This Month Last Year</h3>
                    <p className="mt-1 text-2xl font-semibold text-surface-900 dark:text-white">
                      ₹{totals.thisMonthLastYear.toFixed(2)}
                    </p>
                    <div className="mt-2 text-xs text-surface-600 dark:text-surface-400">
                      {format(new Date(), 'MMMM yyyy')}
                    </div>
                  </div>
                  
                  <div className="card p-4 flex flex-col">
                    <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400">Total Expenses</h3>
                    <p className="mt-1 text-2xl font-semibold text-surface-900 dark:text-white">
                      {expenses.length}
                    </p>
                    <div className="mt-2 text-xs text-surface-600 dark:text-surface-400">
                      {Object.keys(categoryBreakdown).length} categories
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                <div className="lg:col-span-2 card p-6">
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Monthly Spending Trend</h2>
                  
                  {expenses.length ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="w-full h-full bg-surface-100/50 dark:bg-surface-800/50 rounded-lg flex items-center justify-center">
                        <p className="text-surface-600 dark:text-surface-400 italic text-center">
                          Expense trend chart would appear here<br />
                          Showing monthly spending patterns
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-primary/10 dark:bg-primary-dark/20 rounded-full flex items-center justify-center mx-auto">
                          <AnalyticsIcon className="w-8 h-8 text-primary dark:text-primary-light" />
                        </div>
                        <p className="text-surface-600 dark:text-surface-400">No expenses recorded yet</p>
                        <button
                          onClick={() => setSelectedPage('add')}
                          className="btn btn-primary inline-flex items-center"
                        >
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Add your first expense
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Top Categories</h2>
                  
                  {Object.keys(categoryBreakdown).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(categoryBreakdown)
                        .sort((a, b) => b[1].total - a[1].total)
                        .slice(0, 5)
                        .map(([category, data]) => (
                          <div key={category} className="flex items-center">
                            <div className="w-1/2">
                              <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 truncate">
                                {category}
                              </h4>
                              <p className="text-xs text-surface-500 dark:text-surface-400">
                                {data.count} expense{data.count !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <div className="w-1/2 space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium text-surface-800 dark:text-surface-200">
                                  ₹{data.total.toFixed(2)}
                                </span>
                                <span className="text-surface-500 dark:text-surface-400">
                                  {Math.round((data.total / totals.thisYear) * 100)}%
                                </span>
                              </div>
                              <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-1.5">
                                <div
                                  className="bg-primary h-1.5 rounded-full"
                                  style={{ width: `${Math.min(100, Math.round((data.total / totals.thisYear) * 100))}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <p className="text-surface-600 dark:text-surface-400">No categories yet</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          Add expenses to see category breakdown
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Recent Expenses</h2>
                
                {expenses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                      <thead className="bg-surface-50 dark:bg-surface-800">
                        <tr>
                          <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                            Description
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                            Category
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="relative px-3 py-3.5">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                        {expenses.slice(0, 5).map((expense) => (
                          <tr key={expense.id} className="hover:bg-surface-50 dark:hover:bg-surface-750">
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">
                              {format(new Date(expense.date), 'MMM d, yyyy')}
                            </td>
                            <td className="px-3 py-4 text-sm text-surface-900 dark:text-surface-100">
                              {expense.description}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm">
                              <span className="badge badge-primary">{expense.category}</span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium text-surface-900 dark:text-surface-100">
                              ₹{expense.amount.toFixed(2)}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-right text-sm">
                              <button
                                onClick={() => handleDeleteExpense(expense.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {expenses.length > 5 && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => setSelectedPage('history')}
                          className="text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary-light/80 text-sm font-medium"
                        >
                          View all expenses
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center mb-4">
                      <AnalyticsIcon className="w-8 h-8 text-surface-400 dark:text-surface-500" />
                    </div>
                    <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-1">
                      No expenses yet
                    </h3>
                    <p className="text-surface-600 dark:text-surface-400 mb-4 max-w-xs">
                      Start tracking your spending by adding your first expense.
                    </p>
                    <button
                      onClick={() => setSelectedPage('add')}
                      className="btn btn-primary inline-flex items-center"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Expense
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
          
          {selectedPage === 'add' && (
            <div>
              <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
                Add New Expense
              </h1>
              
              <MainFeature onAddExpense={addExpense} />
            </div>
          )}
          
          {selectedPage === 'history' && (
            <div>
              <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
                Expense History
              </h1>
              
              {expenses.length > 0 ? (
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                      <thead className="bg-surface-50 dark:bg-surface-800">
                        <tr>
                          <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                            Description
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                            Category
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="relative px-3 py-3.5">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                        {expenses.map((expense) => (
                          <tr key={expense.id} className="hover:bg-surface-50 dark:hover:bg-surface-750">
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">
                              {format(new Date(expense.date), 'MMM d, yyyy')}
                            </td>
                            <td className="px-3 py-4 text-sm text-surface-900 dark:text-surface-100">
                              {expense.description}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm">
                              <span className="badge badge-primary">{expense.category}</span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium text-surface-900 dark:text-surface-100">
                              ₹{expense.amount.toFixed(2)}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-right text-sm">
                              <button
                                onClick={() => handleDeleteExpense(expense.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="py-8 card p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center mb-4">
                    <HistoryIcon className="w-8 h-8 text-surface-400 dark:text-surface-500" />
                  </div>
                  <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-1">
                    No expense history
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400 mb-4 max-w-xs">
                    Your expense history will appear here once you start adding expenses.
                  </p>
                  <button
                    onClick={() => setSelectedPage('add')}
                    className="btn btn-primary inline-flex items-center"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Your First Expense
                  </button>
                </div>
              )}
            </div>
          )}
          
          {selectedPage === 'settings' && (
            <div>
              <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
                Settings
              </h1>
              
              <div className="card p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
                    Appearance
                  </h3>
                  <div className="flex items-center">
                    <button
                      onClick={toggleDarkMode}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        isDarkMode ? 'bg-primary' : 'bg-surface-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isDarkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="ml-3 text-sm font-medium text-surface-700 dark:text-surface-300">
                      {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
                    Account
                  </h3>
                  <button
                    onClick={logout}
                    className="btn btn-outline text-red-500 dark:text-red-400 border-red-300 dark:border-red-800/30 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Logout
                  </button>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
                    About
                  </h3>
                  <div className="text-sm text-surface-600 dark:text-surface-400">
                    <p>SpendSight v1.0.0</p>
                    <p className="mt-1">A personal expense tracking application</p>
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