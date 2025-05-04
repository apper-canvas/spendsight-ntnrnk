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
    { id: 'food', name: 'Food & Dining', icon: 'Utensils', color: '#0070D2' },
    { id: 'transport', name: 'Transportation', icon: 'Car', color: '#1589EE' },
    { id: 'utilities', name: 'Utilities', icon: 'Lightbulb', color: '#FFB75D' },
    { id: 'entertainment', name: 'Entertainment', icon: 'Film', color: '#4BC076' },
    { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: '#0070D2' },
    { id: 'housing', name: 'Housing', icon: 'Home', color: '#1589EE' },
    { id: 'health', name: 'Healthcare', icon: 'Stethoscope', color: '#4BC076' },
    { id: 'education', name: 'Education', icon: 'GraduationCap', color: '#1589EE' },
    { id: 'custom', name: 'Add Custom...', icon: 'Plus', color: '#706E6B' },
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
      <div className="card relative overflow-hidden">
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
                className="w-12 h-12 bg-brand-success/10 dark:bg-brand-success/20 rounded-full flex items-center justify-center mb-3"
              >
                <CheckCircleIcon className="w-7 h-7 text-brand-success" />
              </motion.div>
              <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">
                Expense Added!
              </h3>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Your expense has been recorded.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="card-header">
          <h2 className="slds-text-heading_small text-surface-900 dark:text-white flex items-center">
            <ReceiptIcon className="w-4 h-4 mr-2 text-primary dark:text-primary-light" />
            New Expense
          </h2>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              {/* Description & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Description field */}
                <div className="slds-form-element">
                  <label htmlFor="description" className="slds-form-element__label">
                    Description
                  </label>
                  <div className="slds-input-has-icon">
                    <div className="slds-input-icon">
                      <ReceiptIcon className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      id="description"
                      className={`input ${errors.description ? 'border-brand-error dark:border-brand-error focus:ring-brand-error' : ''}`}
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
                  </div>
                  {errors.description && (
                    <div className="slds-form-element__help">
                      <AlertCircleIcon className="w-3 h-3 mr-1" />
                      {errors.description}
                    </div>
                  )}
                </div>
                
                {/* Amount field */}
                <div className="slds-form-element">
                  <label htmlFor="amount" className="slds-form-element__label">
                    Amount
                  </label>
                  <div className="slds-input-has-icon">
                    <div className="slds-input-icon">
                      <RupeeIcon className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      id="amount"
                      className={`input ${errors.amount ? 'border-brand-error dark:border-brand-error focus:ring-brand-error' : ''}`}
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
                  </div>
                  {errors.amount && (
                    <div className="slds-form-element__help">
                      <AlertCircleIcon className="w-3 h-3 mr-1" />
                      {errors.amount}
                    </div>
                  )}
                </div>
              </div>
          
              {/* Date field */}
              <div className="slds-form-element">
                <label htmlFor="date" className="slds-form-element__label">
                  Date
                </label>
                <div className="slds-input-has-icon">
                  <div className="slds-input-icon">
                    <CalendarIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    className={`input ${errors.date ? 'border-brand-error dark:border-brand-error focus:ring-brand-error' : ''}`}
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
                </div>
                {errors.date && (
                  <div className="slds-form-element__help">
                    <AlertCircleIcon className="w-3 h-3 mr-1" />
                    {errors.date}
                  </div>
                )}
              </div>
            </div>
            
            {/* Category selection */}
            <div className="slds-form-element">
              <label className="slds-form-element__label">
                Category
              </label>
              
              <div className={`grid grid-cols-3 sm:grid-cols-5 gap-2
                            ${errors.category ? 'border border-brand-error dark:border-brand-error rounded-md p-2' : ''}`}>
                {defaultCategories.map((cat) => {
                  const Icon = categoryIcons[cat.id];
                  const isSelected = !showCustomCategory && category === cat.name;
                  
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`flex flex-col items-center justify-center p-2 rounded-md border transition-all
                                ${isSelected ? 
                                  'border-primary bg-primary/5 dark:bg-primary-dark/10 shadow-sm' : 
                                  'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-750'}`}
                      onClick={() => handleCategorySelect(cat.id)}
                      disabled={isSubmitting}
                    >
                      <div 
                        className="w-8 h-8 flex items-center justify-center rounded-full mb-1" 
                        style={{ backgroundColor: `${cat.color}10`, color: cat.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-surface-700 dark:text-surface-300 whitespace-nowrap overflow-hidden text-ellipsis max-w-full text-center">
                        {cat.name.length > 12 ? cat.name.split(' ')[0] : cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              {errors.category && (
                <div className="slds-form-element__help">
                  <AlertCircleIcon className="w-3 h-3 mr-1" />
                  {errors.category}
                </div>
              )}
              
              {/* Custom category input */}
              {showCustomCategory && (
                <div className="mt-3">
                  <div className="slds-input-has-icon">
                    <div className="slds-input-icon">
                      <TagIcon className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      className={`input ${errors.customCategory ? 'border-brand-error dark:border-brand-error focus:ring-brand-error' : ''}`}
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
                  </div>
                  {errors.customCategory && (
                    <div className="slds-form-element__help">
                      <AlertCircleIcon className="w-3 h-3 mr-1" />
                      {errors.customCategory}
                    </div>
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
                className="w-full btn btn-primary flex items-center justify-center space-x-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <RupeeIcon className="w-4 h-4" />
                    <span>Add Expense</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-3 p-3 bg-brand-primary/5 dark:bg-primary-dark/10 rounded-md border border-primary/10 dark:border-primary-dark/20">
        <p className="text-xs text-surface-700 dark:text-surface-300 flex items-start">
          <span className="mr-2">💡</span> 
          <span>
            <span className="font-medium">Tip:</span> Categorizing expenses helps track spending patterns and identify saving opportunities.
          </span>
        </p>
      </div>
    </motion.div>
  );
}

export default MainFeature;