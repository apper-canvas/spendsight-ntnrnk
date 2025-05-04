const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

export const fetchExpenses = async () => {
  try {
    const apperClient = getApperClient()
    const params = {
      fields: [
        'Id', 'Name', 'description', 'amount', 'category', 'date', 
        'CreatedOn', 'CreatedBy', 'ModifiedOn'
      ],
      orderBy: [{ field: 'date', direction: 'desc' }],
      where: [{ field: "IsDeleted", operator: "equals", value: false }]
    }
    
    const response = await apperClient.fetchRecords('expense', params)
    
    if (!response || !response.data) {
      return []
    }
    
    return response.data.map(expense => ({
      id: expense.Id,
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      createdAt: expense.CreatedOn
    }))
  } catch (error) {
    console.error("Error fetching expenses:", error)
    throw error
  }
}

export const createExpense = async (expenseData) => {
  try {
    const apperClient = getApperClient()
    const params = {
      Name: expenseData.description.substring(0, 30), // Use first part of description as Name
      description: expenseData.description,
      amount: expenseData.amount,
      category: expenseData.category,
      date: expenseData.date
    }
    
    const response = await apperClient.createRecord('expense', params)
    
    if (!response || !response.success) {
      throw new Error("Failed to create expense")
    }
    
    return {
      id: response.data.Id,
      description: response.data.description,
      amount: response.data.amount,
      category: response.data.category,
      date: response.data.date,
      createdAt: response.data.CreatedOn
    }
  } catch (error) {
    console.error("Error creating expense:", error)
    throw error
  }
}

export const updateExpense = async (id, expenseData) => {
  try {
    const apperClient = getApperClient()
    const params = {
      Id: id,
      Name: expenseData.description.substring(0, 30), // Use first part of description as Name
      description: expenseData.description,
      amount: expenseData.amount,
      category: expenseData.category,
      date: expenseData.date
    }
    
    const response = await apperClient.updateRecord('expense', params)
    
    if (!response || !response.success) {
      throw new Error("Failed to update expense")
    }
    
    return {
      id: response.data.Id,
      description: response.data.description,
      amount: response.data.amount,
      category: response.data.category,
      date: response.data.date,
      createdAt: response.data.CreatedOn
    }
  } catch (error) {
    console.error("Error updating expense:", error)
    throw error
  }
}

export const deleteExpense = async (id) => {
  try {
    const apperClient = getApperClient()
    const response = await apperClient.deleteRecord('expense', { Id: id })
    
    if (!response || !response.success) {
      throw new Error("Failed to delete expense")
    }
    
    return true
  } catch (error) {
    console.error("Error deleting expense:", error)
    throw error
  }
}