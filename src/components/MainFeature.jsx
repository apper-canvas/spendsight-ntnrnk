import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { createExpense } from '../services/expenseService';

function MainFeature({ onAddExpense }) {
  // Icons
  const RupeeIcon = getIcon('IndianRupee');
  const TagIcon = getIcon('Tag');
  const CalendarIcon = getIcon('Calendar');
  const ReceiptIcon = getIcon('Receipt');
  const CheckCircleIcon = getIcon('CheckCircle');
  const AlertCircleIcon = getIcon('AlertCircle');
  
  // Expense form state
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Default categories
  const defaultCategories = [
    { id: 'food', name: 'Food & Dining', icon: 'Utensils', color: 'rgb(239, 68, 68)' },
    { id: 'transport', name: 'Transportation', icon: 'Car', color: 'rgb(59, 130, 246)' },
    { id: 'utilities', name: 'Utilities', icon: 'Lightbulb', color: 'rgb(245, 158, 11)' },
    { id: 'entertainment', name: 'Entertainment', icon: 'Film', color: 'rgb(139, 92, 246)' },
    { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: 'rgb(236, 72, 153)' },
    { id: 'housing', name: 'Housing', icon: 'Home', color: 'rgb(34, 197, 94)' },
    { id: 'health', name: 'Healthcare', icon: 'Stethoscope', color: 'rgb(14, 165, 233)' },
    { id: 'education', name: 'Education', icon: 'GraduationCap', color: 'rgb(168, 85, 247)' },
    { id: 'custom', name: 'Add Custom...', icon: 'Plus', color: 'rgb(75, 85, 99)' },
  ];
  
  // Get icon components for each category
  const categoryIcons = {};
  defaultCategories.forEach(cat => {
    categoryIcons[cat.id] = getIcon(cat.icon);
  });
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    
    const finalCategory = showCustomCategory ? customCategory.trim() : category;
    if (!finalCategory) newErrors.category = 'Category is required';
    if (showCustomCategory && !customCategory.trim()) {
      newErrors.customCategory = 'Custom category name is required';
    }
    
    if (!date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    
    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      
      try {
        const newExpense = {
          description,
          amount: parseFloat(amount),
          category: finalCategory,
          date,
        };
        
        // Save to database
        const savedExpense = await createExpense(newExpense);
        
        // Update UI
        onAddExpense(savedExpense);
        
        // Reset form and show success state
        setDescription('');
        setAmount('');
        setCategory('');
        setCustomCategory('');
        setShowCustomCategory(false);
        setDate(new Date().toISOString().split('T')[0]);
        setSubmitSuccess(true);
        
        // Reset success state after a delay
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 2000);
      } catch (error) {
        toast.error("Failed to add expense: " + (error.message || "Unknown error"));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fix the errors in the form");
    }
  };
  
  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    if (categoryId === 'custom') {
      setShowCustomCategory(true);
      setCategory('');
    } else {
      setShowCustomCategory(false);
      setCategory(defaultCategories.find(c => c.id === categoryId).name);
    }
    setErrors({ ...errors, category: undefined, customCategory: undefined });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="card p-2 relative overflow-hidden">
        {/* Success overlay */}
        <AnimatePresence>
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white dark:bg-surface-800 z-10 flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2"
              >
                <CheckCircleIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
              </motion.div>
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-0.5">
                Expense Added!
              </h3>
              <p className="text-2xs text-surface-600 dark:text-surface-400">
                Your expense has been recorded.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <h2 className="text-sm font-bold text-surface-900 dark:text-white mb-2 flex items-center">
          <ReceiptIcon className="w-4 h-4 mr-1 text-primary dark:text-primary-light" />
          New Expense
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            {/* Description & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Description field */}
              <div className="space-y-0.5">
                <label htmlFor="description" className="block text-2xs font-medium text-surface-700 dark:text-surface-300">
                  Description
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="description"
                    className={`input-compact w-full ${errors.description ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="What did you spend on?"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (errors.description) {
                        setErrors({ ...errors, description: undefined });
                      }
                    }}
                    disabled={isSubmitting}
                  />
                  <div className="absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none">
                    <span className="text-surface-500 dark:text-surface-400">
                      <ReceiptIcon className="h-3 w-3" />
                    </span>
                  </div>
                </div>
                {errors.description && (
                  <p className="text-2xs text-red-500 flex items-center mt-0.5">
                    <AlertCircleIcon className="w-2.5 h-2.5 mr-0.5" />
                    {errors.description}
                  </p>
                )}
              </div>
              
              {/* Amount field */}
              <div className="space-y-0.5">
                <label htmlFor="amount" className="block text-2xs font-medium text-surface-700 dark:text-surface-300">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="amount"
                    className={`input-compact w-full ${errors.amount ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => {
                      // Allow only numbers and decimal point
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      setAmount(value);
                      if (errors.amount) {
                        setErrors({ ...errors, amount: undefined });
                      }
                    }}
                    disabled={isSubmitting}
                  />
                  <div className="absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none">
                    <span className="text-surface-500 dark:text-surface-400">
                      <RupeeIcon className="h-3 w-3" />
                    </span>
                  </div>
                </div>
                {errors.amount && (
                  <p className="text-2xs text-red-500 flex items-center mt-0.5">
                    <AlertCircleIcon className="w-2.5 h-2.5 mr-0.5" />
                    {errors.amount}
                  </p>
                )}
              </div>
            </div>
        
            {/* Date field */}
            <div className="space-y-0.5">
              <label htmlFor="date" className="block text-2xs font-medium text-surface-700 dark:text-surface-300">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  className={`input-compact w-full ${errors.date ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : ''}`}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (errors.date) {
                      setErrors({ ...errors, date: undefined });
                    }
                  }}
                  max={new Date().toISOString().split('T')[0]}
                  disabled={isSubmitting}
                />
                <div className="absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none">
                  <span className="text-surface-500 dark:text-surface-400">
                    <CalendarIcon className="h-3 w-3" />
                  </span>
                </div>
              </div>
              {errors.date && (
                <p className="text-2xs text-red-500 flex items-center mt-0.5">
                  <AlertCircleIcon className="w-2.5 h-2.5 mr-0.5" />
                  {errors.date}
                </p>
              )}
            </div>
          </div>
          
          {/* Category selection */}
          <div className="space-y-0.5">
            <label className="block text-2xs font-medium text-surface-700 dark:text-surface-300">
              Category
            </label>
            
            <div className={`grid grid-cols-4 gap-1 
                          ${errors.category ? 'border border-red-500 dark:border-red-500 rounded-lg p-1' : ''}`}>
              {defaultCategories.map((cat) => {
                const Icon = categoryIcons[cat.id];
                const isSelected = !showCustomCategory && category === cat.name;
                
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`flex flex-col items-center justify-center p-1 rounded-lg border transition-all h-sm
                              ${isSelected ? 
                                'border-primary bg-primary/5 dark:bg-primary-dark/10 shadow-sm' : 
                                'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-750'}`}
                    onClick={() => handleCategorySelect(cat.id)}
                    disabled={isSubmitting}
                  >
                    <div 
                      className="w-4 h-4 flex items-center justify-center rounded-full" 
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                      <Icon className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-2xs font-medium text-surface-700 dark:text-surface-300 whitespace-nowrap overflow-hidden text-ellipsis max-w-full text-center mt-0.5">
                      {cat.name.length > 8 ? cat.name.split(' ')[0] : cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {errors.category && (
              <p className="text-2xs text-red-500 flex items-center mt-0.5">
                <AlertCircleIcon className="w-2.5 h-2.5 mr-0.5" />
                {errors.category}
              </p>
            )}
            
            {/* Custom category input */}
            {showCustomCategory && (
              <div className="mt-1">
                <div className="relative">
                  <input
                    type="text"
                    className={`input-compact w-full ${errors.customCategory ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter custom category"
                    value={customCategory}
                    onChange={(e) => {
                      setCustomCategory(e.target.value);
                      if (errors.customCategory) {
                        setErrors({ ...errors, customCategory: undefined });
                      }
                    }}
                    disabled={isSubmitting}
                  />
                  <div className="absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none">
                    <span className="text-surface-500 dark:text-surface-400">
                      <TagIcon className="h-3 w-3" />
                    </span>
                  </div>
                </div>
                {errors.customCategory && (
                  <p className="text-2xs text-red-500 flex items-center mt-0.5">
                    <AlertCircleIcon className="w-2.5 h-2.5 mr-0.5" />
                    {errors.customCategory}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Submit button */}
          <div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full btn-compact btn-primary flex items-center justify-center space-x-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <RupeeIcon className="w-3 h-3" />
                  <span>Add Expense</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
      
      <div className="mt-2 p-2 bg-surface-100/50 dark:bg-surface-800/50 rounded-lg">
        <p className="text-2xs text-surface-600 dark:text-surface-400">
          💡 <span className="font-medium">Tip:</span> Categorizing expenses helps track spending patterns and identify saving opportunities.
        </p>
      </div>
    </motion.div>
  );
}

export default MainFeature;