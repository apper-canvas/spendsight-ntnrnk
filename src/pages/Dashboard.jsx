import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, subMonths, startOfYear, isSameMonth, isSameYear, endOfMonth, startOfMonth } from 'date-fns';
import { useSelector } from 'react-redux';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import { deleteExpense } from '../services/expenseService';
import { fetchExpensesWithFallback } from '../services/dataService';
import { AuthContext } from '../contexts/AuthContext';
import FloatingActionButton from '../components/FloatingActionButton';
import BottomActionsBar from '../components/BottomActionsBar';

function Dashboard({ isDarkMode, toggleDarkMode }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState('dashboard');
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState({ min: '', max: '' });
  
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
  const SortIcon = getIcon('ArrowUpDown');
  const SearchIcon = getIcon('Search');
  
  useEffect(() => {
    const loadExpenses = async () => {
      setIsLoading(true);
      try {
        // Use the dataService with fallback to sample data
        const response = await fetchExpensesWithFallback();
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
  
  // Filter functions
  const resetFilters = () => {
    setDateFilter('all');
    setCategoryFilter('all');
    setAmountFilter({ min: '', max: '' });
    setIsFilterBarOpen(false);
    toast.info("Filters reset");
  };

  const applyFilters = () => {
    setIsFilterBarOpen(false);
    toast.success("Filters applied");
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
    
    // Fixed calculation for "This Month Last Year"
    const currentMonth = now.getMonth();
    const lastYearValue = now.getFullYear() - 1;
    
    // Create start and end dates for the same month last year
    const startOfLastYearSameMonth = startOfMonth(new Date(lastYearValue, currentMonth, 1));
    const endOfLastYearSameMonth = endOfMonth(new Date(lastYearValue, currentMonth, 1));
    
    const thisMonthLastYear = expensesArray.reduce((acc, expense) => {
      const expenseDate = new Date(expense.date);
      // Check if the expense date falls within the date range of same month last year
      return (expenseDate >= startOfLastYearSameMonth && expenseDate <= endOfLastYearSameMonth) 
        ? acc + expense.amount : acc;
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
        <div className="slds-spinner"></div>
        <p className="mt-3 text-sm text-surface-600 dark:text-surface-300">Loading...</p>
      </div>
    );
  }

  // Define all unique categories for filter options
  const uniqueCategories = [...new Set(expenses.map(expense => expense.category))];

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900">
      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Mobile Bottom Nav / Desktop Side Nav - SLDS Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 md:relative md:w-16 lg:w-48 bg-white dark:bg-surface-800 border-t md:border-r border-surface-200 dark:border-surface-700 z-10 h-14 md:h-auto">
          <div className="md:sticky md:top-0 md:h-screen flex md:flex-col">
            <div className="h-14 md:h-14 md:border-b border-surface-200 dark:border-surface-700 hidden md:flex md:items-center md:justify-between px-3">
              <span className="lg:hidden flex items-center justify-center">
                <AnalyticsIcon className="w-5 h-5 text-primary" />
              </span>
              <button
                onClick={toggleDarkMode}
                className="p-1.5 rounded-md bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex md:flex-col justify-around md:justify-start md:mt-3 md:space-y-1 md:px-2 h-full md:h-auto">
              <button
                onClick={() => setSelectedPage('dashboard')}
                className={`flex items-center justify-center md:justify-start py-2 px-3 rounded-md transition-colors
                          ${selectedPage === 'dashboard' ? 
                            'text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-dark/20' : 
                            'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                aria-label="Dashboard"
              >
                <HomeIcon className="w-5 h-5 shrink-0" />
                <span className="sr-only md:not-sr-only ml-2 font-medium tracking-wide hidden lg:block text-xs">Dashboard</span>
              </button>
              
              <button
                onClick={() => setSelectedPage('add')}
                className={`flex items-center justify-center md:justify-start py-2 px-3 rounded-md transition-colors
                          ${selectedPage === 'add' ? 
                            'text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-dark/20' : 
                            'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                aria-label="Add Expense"
              >
                <PlusIcon className="w-5 h-5 shrink-0" />
                <span className="sr-only md:not-sr-only ml-2 font-medium tracking-wide hidden lg:block text-xs">Add Expense</span>
              </button>
              
              <button
                onClick={() => setSelectedPage('history')}
                className={`flex items-center justify-center md:justify-start py-2 px-3 rounded-md transition-colors
                          ${selectedPage === 'history' ? 
                            'text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-dark/20' : 
                            'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                aria-label="Expense History"
              >
                <HistoryIcon className="w-5 h-5 shrink-0" />
                <span className="sr-only md:not-sr-only ml-2 font-medium tracking-wide hidden lg:block text-xs">History</span>
              </button>
              
              <button
                onClick={() => setSelectedPage('settings')}
                className={`flex items-center justify-center md:justify-start py-2 px-3 rounded-md transition-colors
                          ${selectedPage === 'settings' ? 
                            'text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-dark/20' : 
                            'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                aria-label="Settings"
              >
                <SettingsIcon className="w-5 h-5 shrink-0" />
                <span className="sr-only md:not-sr-only ml-2 font-medium tracking-wide hidden lg:block text-xs">Settings</span>
              </button>

              <div className="hidden md:block md:mt-auto md:mb-4">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center md:justify-start py-2 px-3 rounded-md transition-colors
                            text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700"
                  aria-label="Logout"
                >
                  <LogOutIcon className="w-5 h-5 shrink-0" />
                  <span className="sr-only md:not-sr-only ml-2 font-medium tracking-wide hidden lg:block text-xs">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Main content area */}
        <main className="flex-1 py-4 px-4 mb-14 md:mb-0 relative">
          {/* Dark mode toggle for mobile (fixed at the top right) */}
          <div className="md:hidden absolute top-2 right-4 z-20">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-md bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors shadow-sm"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
            </button>
          </div>
          
          {selectedPage === 'dashboard' && (
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h1 className="slds-text-heading_medium text-brand-info dark:text-white">
                  Expense Dashboard
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="card slds-p-around_medium">
                    <div className="slds-stat">
                      <h3 className="slds-stat-title">This Year Total</h3>
                      <p className="slds-stat-value">
                        ₹{totals.thisYear.toFixed(0)}
                      </p>
                      <div className="slds-stat-desc">
                        {totals.thisYear > totals.lastYear ? 
                          <span className="text-brand-error dark:text-brand-error flex items-center">
                            <span className="inline-block mr-1">↑</span> 
                            {((totals.thisYear - totals.lastYear) / (totals.lastYear || 1) * 100).toFixed(0)}% vs last yr
                          </span> : 
                          <span className="text-brand-success dark:text-brand-success flex items-center">
                            <span className="inline-block mr-1">↓</span> 
                            {((totals.lastYear - totals.thisYear) / (totals.lastYear || 1) * 100).toFixed(0)}% vs last yr
                          </span>
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="card slds-p-around_medium">
                    <div className="slds-stat">
                      <h3 className="slds-stat-title">Last 3 Months</h3>
                      <p className="slds-stat-value">
                        ₹{totals.last3Months.toFixed(0)}
                      </p>
                      <div className="slds-stat-desc">
                        {expenses.length > 0 ? 
                          `${Math.round(totals.last3Months / totals.thisYear * 100)}% of yearly` : 
                          'No expenses yet'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="card slds-p-around_medium">
                    <div className="slds-stat">
                      <h3 className="slds-stat-title">This Month Last Year</h3>
                      <p className="slds-stat-value">
                        ₹{totals.thisMonthLastYear.toFixed(0)}
                      </p>
                      <div className="slds-stat-desc">
                        {format(new Date(), 'MMM yyyy')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="card slds-p-around_medium">
                    <div className="slds-stat">
                      <h3 className="slds-stat-title">Total Expenses</h3>
                      <p className="slds-stat-value">
                        {expenses.length}
                      </p>
                      <div className="slds-stat-desc">
                        {Object.keys(categoryBreakdown).length} categories
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 gap-4"
              >
                <div className="card">
                  <div className="card-header">
                    <h2 className="slds-text-heading_small text-brand-info dark:text-white">Top Categories</h2>
                  </div>
                  
                  <div className="card-body">
                    {Object.keys(categoryBreakdown).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(categoryBreakdown)
                          .sort((a, b) => b[1].total - a[1].total)
                          .slice(0, 4)
                          .map(([category, data]) => (
                            <div key={category} className="flex items-center">
                              <div className="w-1/2">
                                <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 truncate">
                                  {category}
                                </h4>
                                <p className="text-xs text-surface-500 dark:text-surface-400">
                                  {data.count} expenses
                                </p>
                              </div>
                              <div className="w-1/2 space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="font-medium text-surface-800 dark:text-surface-200">
                                    ₹{data.total.toFixed(0)}
                                  </span>
                                  <span className="text-surface-500 dark:text-surface-400">
                                    {Math.round((data.total / totals.thisYear) * 100)}%
                                  </span>
                                </div>
                                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-1">
                                  <div
                                    className="bg-primary h-1 rounded-full"
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
                          <p className="text-sm text-surface-600 dark:text-surface-400">No categories yet</p>
                          <p className="text-xs text-surface-500 dark:text-surface-400">
                            Add expenses to see breakdown
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="card">
                  <div className="card-header">
                    <h2 className="slds-text-heading_small text-brand-info dark:text-white">Recent Expenses</h2>
                    
                    {expenses.length > 2 && (
                      <button
                        onClick={() => setSelectedPage('history')}
                        className="text-primary dark:text-primary-light text-xs font-medium"
                      >
                        View all
                      </button>
                    )}
                  </div>
                  
                  {expenses.length > 0 ? (
                    <div className="p-0">
                      <table className="slds-table w-full">
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Category</th>
                            <th className="text-right">Amount</th>
                            <th className="w-20"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenses.slice(0, 4).map((expense) => (
                            <tr key={expense.id}>
                              <td className="font-medium text-surface-900 dark:text-white">
                                {expense.description}
                              </td>
                              <td className="text-surface-600 dark:text-surface-400">
                                {format(new Date(expense.date), 'dd MMM')}
                              </td>
                              <td>
                                <span className="badge badge-primary text-xs">
                                  {expense.category.length > 15 ? expense.category.substring(0, 15) + '...' : expense.category}
                                </span>
                              </td>
                              <td className="text-right font-medium">
                                ₹{expense.amount.toFixed(0)}
                              </td>
                              <td className="text-right">
                                <button
                                  onClick={() => handleDeleteExpense(expense.id)}
                                  className="text-xs text-brand-error hover:text-brand-error/80 dark:text-brand-error dark:hover:text-brand-error/80"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-6 px-4 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center mb-3">
                        <AnalyticsIcon className="w-6 h-6 text-surface-400 dark:text-surface-500" />
                      </div>
                      <h3 className="text-base font-medium text-surface-900 dark:text-white mb-2">
                        No expenses yet
                      </h3>
                      <p className="text-sm text-surface-600 dark:text-surface-400 mb-4 max-w-xs">
                        Start tracking your spending by adding your first expense.
                      </p>
                      <button
                        onClick={() => setSelectedPage('add')}
                        className="btn btn-primary flex items-center text-sm"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Expense
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
          
          {selectedPage === 'add' && (
            <div className="space-y-4">
              <h1 className="slds-text-heading_medium text-brand-info dark:text-white">
                Add New Expense
              </h1>
              
              <MainFeature onAddExpense={addExpense} />
            </div>
          )}
          
          {selectedPage === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h1 className="slds-text-heading_medium text-brand-info dark:text-white">
                  Expense History
                </h1>
                <button 
                  className="btn btn-secondary flex items-center text-sm"
                  onClick={() => setIsFilterBarOpen(true)}
                  aria-label="Filter expenses"
                >
                  <FilterIcon className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
              
              {expenses.length > 0 ? (
                <div className="card">
                  <table className="slds-table w-full">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th className="text-right">Amount</th>
                        <th className="w-20"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((expense) => (
                        <tr key={expense.id}>
                          <td className="font-medium text-surface-900 dark:text-white">
                            {expense.description}
                          </td>
                          <td className="text-surface-600 dark:text-surface-400">
                            {format(new Date(expense.date), 'dd MMM yyyy')}
                          </td>
                          <td>
                            <span className="badge badge-primary text-xs">
                              {expense.category.length > 15 ? expense.category.substring(0, 15) + '...' : expense.category}
                            </span>
                          </td>
                          <td className="text-right font-medium">
                            ₹{expense.amount.toFixed(0)}
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-xs text-brand-error hover:text-brand-error/80 dark:text-brand-error dark:hover:text-brand-error/80"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-6 card flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center mb-3">
                    <HistoryIcon className="w-6 h-6 text-surface-400 dark:text-surface-500" />
                  </div>
                  <h3 className="text-base font-medium text-surface-900 dark:text-white mb-2">
                    No expense history
                  </h3>
                  <p className="text-sm text-surface-600 dark:text-surface-400 mb-4 max-w-xs">
                    Your expense history will appear here once you start adding expenses.
                  </p>
                  <button
                    onClick={() => setSelectedPage('add')}
                    className="btn btn-primary flex items-center text-sm"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add First Expense
                  </button>
                </div>
              )}
            </div>
          )}
          
          {selectedPage === 'settings' && (
            <div className="space-y-4">
              <h1 className="slds-text-heading_medium text-brand-info dark:text-white">
                Settings
              </h1>
              
              <div className="card">
                <div className="card-header border-b border-surface-200 dark:border-surface-700">
                  <h2 className="slds-text-heading_small text-brand-info dark:text-white">Appearance</h2>
                </div>
                <div className="card-body">
                  <div className="flex items-center">
                    <button
                      onClick={toggleDarkMode}
                      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                        isDarkMode ? 'bg-primary' : 'bg-surface-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isDarkMode ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="ml-3 text-sm font-medium text-surface-800 dark:text-surface-200">
                      {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="card-header border-b border-surface-200 dark:border-surface-700">
                  <h2 className="slds-text-heading_small text-brand-info dark:text-white">Account</h2>
                </div>
                <div className="card-body">
                  <button
                    onClick={logout}
                    className="btn btn-danger flex items-center text-sm"
                  >
                    <LogOutIcon className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
              
              <div className="card">
                <div className="card-header border-b border-surface-200 dark:border-surface-700">
                  <h2 className="slds-text-heading_small text-brand-info dark:text-white">About</h2>
                </div>
                <div className="card-body">
                  <div className="text-sm text-surface-600 dark:text-surface-400">
                    <p>v1.0.0</p>
                    <p className="mt-1">A personal expense tracking application</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Action Button for adding expense */}
      {selectedPage !== 'add' && (
        <FloatingActionButton
          icon={<PlusIcon />}
          label="Add Expense"
          onClick={() => setSelectedPage('add')}
          position="bottom-right"
          color="primary"
          showLabel={false}
        />
      )}

      {/* Filter Action Button for History page */}
      {selectedPage === 'history' && (
        <FloatingActionButton
          icon={<SortIcon />}
          label="Sort Expenses"
          onClick={() => setIsFilterBarOpen(true)}
          position="bottom-left"
          color="neutral"
          size="small"
          showLabel={false}
        />
      )}

      {/* Bottom Filter Bar - SLDS Modal */}
      <BottomActionsBar
        isOpen={isFilterBarOpen}
        onClose={() => setIsFilterBarOpen(false)}
        title="Filter Expenses"
        position="bottom"
        height="auto"
      >
        <div className="space-y-4">
          {/* Date filter */}
          <div className="slds-form-element">
            <label className="slds-form-element__label">
              Date Range
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Time</option>
              <option value="this-month">This Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="this-year">This Year</option>
              <option value="last-year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="slds-form-element">
            <label className="slds-form-element__label">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Amount range filter */}
          <div className="slds-form-element">
            <label className="slds-form-element__label">
              Amount Range
            </label>
            <div className="flex space-x-3">
              <div className="w-1/2">
                <label className="block text-xs text-surface-600 dark:text-surface-400 mb-1">
                  Min
                </label>
                <div className="slds-input-has-icon">
                  <div className="slds-input-icon">
                    <span className="text-xs">₹</span>
                  </div>
                  <input
                    type="number"
                    value={amountFilter.min}
                    onChange={(e) => setAmountFilter({...amountFilter, min: e.target.value})}
                    className="input"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-xs text-surface-600 dark:text-surface-400 mb-1">
                  Max
                </label>
                <div className="slds-input-has-icon">
                  <div className="slds-input-icon">
                    <span className="text-xs">₹</span>
                  </div>
                  <input
                    type="number"
                    value={amountFilter.max}
                    onChange={(e) => setAmountFilter({...amountFilter, max: e.target.value})}
                    className="input"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filter actions */}
          <div className="flex space-x-3 pt-2">
            <button
              onClick={resetFilters}
              className="btn btn-secondary flex-1"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="btn btn-primary flex-1"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </BottomActionsBar>
    </div>
  );
}

export default Dashboard;