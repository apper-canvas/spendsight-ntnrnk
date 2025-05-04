/**
 * Service for handling expense data operations
 */

// Initialize ApperClient for data operations
function getApperClient() {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
}

// Fetch all expenses with optional filtering
export async function fetchExpenses(filters = {}, page = 1, limit = 20) {
  try {
    const apperClient = getApperClient();
    const offset = (page - 1) * limit;
    
    // Build where conditions based on filters
    let whereConditions = [];
    
    if (filters.category && filters.category !== 'All') {
      whereConditions.push({ 
        field: "category", 
        operator: "equals", 
        value: filters.category 
      });
    }
    
    if (filters.search) {
      whereConditions.push({
        operator: "or",
        conditions: [
          { field: "Name", operator: "contains", value: filters.search },
          { field: "description", operator: "contains", value: filters.search }
        ]
      });
    }
    
    if (filters.dateFrom) {
      whereConditions.push({ 
        field: "date", 
        operator: "greaterThanOrEqual", 
        value: filters.dateFrom
      });
    }
    
    if (filters.dateTo) {
      whereConditions.push({ 
        field: "date", 
        operator: "lessThanOrEqual", 
        value: filters.dateTo
      });
    }
    
    // Fetch expenses
    const response = await apperClient.fetchRecords('expense', {
      fields: [
        "Id", "Name", "description", "amount", "category", "date",
        "Tags", "CreatedOn", "ModifiedOn"
      ],
      where: whereConditions,
      orderBy: [{ field: "date", direction: "desc" }],
      pagingInfo: { limit, offset }
    });
    
    return {
      data: response.data || [],
      total: response.totalRecordCount || 0,
      currentPage: page,
      totalPages: Math.ceil((response.totalRecordCount || 0) / limit)
    };
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
}

// Get a single expense by ID
export async function getExpenseById(id) {
  try {
    const apperClient = getApperClient();
    
    const response = await apperClient.getRecordById('expense', id, {
      fields: [
        "Id", "Name", "description", "amount", "category", "date",
        "Tags", "CreatedOn", "ModifiedOn"
      ]
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching expense with ID ${id}:`, error);
    throw error;
  }
}

// Create a new expense
export async function createExpense(expenseData) {
  try {
    const apperClient = getApperClient();
    
    const response = await apperClient.createRecord('expense', {
      records: [expenseData]
    });
    
    if (response.success && response.results && response.results[0].success) {
      return response.results[0].data;
    } else {
      throw new Error(response.results[0]?.message || "Failed to create expense");
    }
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
}

// Update an existing expense
export async function updateExpense(id, expenseData) {
  try {
    const apperClient = getApperClient();
    
    // Ensure ID is included in the update data
    const updateData = { ...expenseData, Id: id };
    
    const response = await apperClient.updateRecord('expense', {
      records: [updateData]
    });
    
    if (response.success && response.results && response.results[0].success) {
      return response.results[0].data;
    } else {
      throw new Error(response.results[0]?.message || "Failed to update expense");
    }
  } catch (error) {
    console.error(`Error updating expense with ID ${id}:`, error);
    throw error;
  }
}

// Delete an expense
export async function deleteExpense(id) {
  try {
    const apperClient = getApperClient();
    
    const response = await apperClient.deleteRecord('expense', {
      RecordIds: [id]
    });
    
    if (response.success && response.results && response.results[0].success) {
      return true;
    } else {
      throw new Error(response.results[0]?.message || "Failed to delete expense");
    }
  } catch (error) {
    console.error(`Error deleting expense with ID ${id}:`, error);
    throw error;
  }
}

// Get expense statistics
export async function getExpenseStats(filters = {}) {
  try {
    const apperClient = getApperClient();
    
    // Build where conditions based on filters
    let whereConditions = [];
    
    if (filters.dateFrom) {
      whereConditions.push({ 
        field: "date", 
        operator: "greaterThanOrEqual", 
        value: filters.dateFrom
      });
    }
    
    if (filters.dateTo) {
      whereConditions.push({ 
        field: "date", 
        operator: "lessThanOrEqual", 
        value: filters.dateTo
      });
    }
    
    // Get total expenses by category
    const categoryResponse = await apperClient.fetchRecords('expense', {
      fields: ["category"],
      aggregators: [
        { field: "amount", function: "sum", alias: "totalAmount" }
      ],
      groupBy: ["category"],
      where: whereConditions
    });
    
    // Get expenses by date (for timeline)
    const timelineResponse = await apperClient.fetchRecords('expense', {
      fields: ["date"],
      aggregators: [
        { field: "amount", function: "sum", alias: "totalAmount" }
      ],
      groupBy: ["date"],
      where: whereConditions,
      orderBy: [{ field: "date", direction: "asc" }]
    });
    
    return {
      categoryData: categoryResponse.data || [],
      timelineData: timelineResponse.data || []
    };
  } catch (error) {
    console.error("Error fetching expense statistics:", error);
    throw error;
  }
}