/**
 * Service for handling data operations with fallback to sample data
 */
import { fetchExpenses, getExpenseById, createExpense, updateExpense, deleteExpense, getExpenseStats } from './expenseService';
import generateSampleExpenses from '../utils/sampleData';

// Fetch expenses with fallback to sample data
export async function fetchExpensesWithFallback(filters = {}, page = 1, limit = 20) {
  try {
    // First try to get data from the backend
    const response = await fetchExpenses(filters, page, limit);
    
    // If no data returned or empty array, fall back to sample data
    if (!response.data || response.data.length === 0) {
      console.log('No data from API, falling back to sample data');
      
      // Generate sample data
      const sampleData = generateSampleExpenses();
      
      // Apply any filters here if needed
      let filteredData = sampleData;
      
      if (filters.category && filters.category !== 'All') {
        filteredData = filteredData.filter(expense => 
          expense.category === filters.category
        );
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(expense => 
          expense.description.toLowerCase().includes(searchLower) || 
          expense.Name.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.dateFrom) {
        filteredData = filteredData.filter(expense => 
          new Date(expense.date) >= new Date(filters.dateFrom)
        );
      }
      
      if (filters.dateTo) {
        filteredData = filteredData.filter(expense => 
          new Date(expense.date) <= new Date(filters.dateTo)
        );
      }
      
      // Handle pagination
      const startIndex = (page - 1) * limit;
      const paginatedData = filteredData.slice(startIndex, startIndex + limit);
      const total = filteredData.length;
      
      return {
        data: paginatedData,
        total: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      };
    }
    
    // Otherwise return the API response
    return response;
  } catch (error) {
    console.error("Error fetching expenses, falling back to sample data:", error);
    
    // Generate sample data as fallback
    const sampleData = generateSampleExpenses();
    
    // Handle pagination of sample data
    const startIndex = (page - 1) * limit;
    const paginatedData = sampleData.slice(startIndex, startIndex + limit);
    const total = sampleData.length;
    
    return {
      data: paginatedData,
      total: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    };
  }
}

// Get a single expense by ID with fallback to sample data
export async function getExpenseByIdWithFallback(id) {
  try {
    // First try to get from the backend
    const expense = await getExpenseById(id);
    
    // If no data returned, fall back to sample data
    if (!expense) {
      console.log('No expense found by ID, looking in sample data');
      const sampleData = generateSampleExpenses();
      const foundExpense = sampleData.find(e => e.Id === id || e.id === id);
      
      if (foundExpense) {
        return foundExpense;
      } else {
        throw new Error('Expense not found');
      }
    }
    
    return expense;
  } catch (error) {
    console.error(`Error fetching expense with ID ${id}, checking sample data:`, error);
    
    // Try to find in sample data
    const sampleData = generateSampleExpenses();
    const foundExpense = sampleData.find(e => e.Id === id || e.id === id);
    
    if (foundExpense) {
      return foundExpense;
    } else {
      throw new Error('Expense not found');
    }
  }
}

// Create a new expense
export async function createExpenseWithFallback(expenseData) {
  try {
    // Try to create in the backend
    const response = await createExpense(expenseData);
    return response;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
}

// Update an existing expense
export async function updateExpenseWithFallback(id, expenseData) {
  try {
    // Try to update in the backend
    const response = await updateExpense(id, expenseData);
    return response;
  } catch (error) {
    console.error(`Error updating expense with ID ${id}:`, error);
    throw error;
  }
}

// Delete an expense
export async function deleteExpenseWithFallback(id) {
  try {
    // Try to delete from the backend
    const response = await deleteExpense(id);
    return response;
  } catch (error) {
    console.error(`Error deleting expense with ID ${id}:`, error);
    throw error;
  }
}

// Get expense statistics with fallback to calculated sample data
export async function getExpenseStatsWithFallback(filters = {}) {
  try {
    // First try to get from the backend
    const stats = await getExpenseStats(filters);
    
    // If no data or empty arrays returned, calculate from sample data
    if (!stats || !stats.categoryData || !stats.timelineData || 
        stats.categoryData.length === 0 || stats.timelineData.length === 0) {
      console.log('No stats from API, calculating from sample data');
      
      const sampleData = generateSampleExpenses();
      
      // Apply date filters if needed
      let filteredData = sampleData;
      
      if (filters.dateFrom) {
        filteredData = filteredData.filter(expense => 
          new Date(expense.date) >= new Date(filters.dateFrom)
        );
      }
      
      if (filters.dateTo) {
        filteredData = filteredData.filter(expense => 
          new Date(expense.date) <= new Date(filters.dateTo)
        );
      }
      
      // Calculate category data
      const categoryData = [];
      const categoryTotals = {};
      
      filteredData.forEach(expense => {
        if (!categoryTotals[expense.category]) {
          categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
      });
      
      Object.entries(categoryTotals).forEach(([category, totalAmount]) => {
        categoryData.push({
          category,
          totalAmount
        });
      });
      
      // Calculate timeline data
      const timelineData = [];
      const dateTotals = {};
      
      filteredData.forEach(expense => {
        if (!dateTotals[expense.date]) {
          dateTotals[expense.date] = 0;
        }
        dateTotals[expense.date] += expense.amount;
      });
      
      // Sort dates chronologically
      const sortedDates = Object.keys(dateTotals).sort();
      
      sortedDates.forEach(date => {
        timelineData.push({
          date,
          totalAmount: dateTotals[date]
        });
      });
      
      return {
        categoryData,
        timelineData
      };
    }
    
    // Otherwise return the API response
    return stats;
  } catch (error) {
    console.error("Error fetching expense statistics, calculating from sample data:", error);
    
    // Calculate from sample data as fallback
    const sampleData = generateSampleExpenses();
    
    // Apply filters if needed
    let filteredData = sampleData;
    
    // Calculate category data
    const categoryData = [];
    const categoryTotals = {};
    
    filteredData.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });
    
    Object.entries(categoryTotals).forEach(([category, totalAmount]) => {
      categoryData.push({
        category,
        totalAmount
      });
    });
    
    // Calculate timeline data
    const timelineData = [];
    const dateTotals = {};
    
    filteredData.forEach(expense => {
      if (!dateTotals[expense.date]) {
        dateTotals[expense.date] = 0;
      }
      dateTotals[expense.date] += expense.amount;
    });
    
    // Sort dates chronologically
    const sortedDates = Object.keys(dateTotals).sort();
    
    sortedDates.forEach(date => {
      timelineData.push({
        date,
        totalAmount: dateTotals[date]
      });
    });
    
    return {
      categoryData,
      timelineData
    };
  }
}