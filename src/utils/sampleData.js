import { subDays, subMonths, format, getMonth, getYear } from 'date-fns';

// Helper to generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to get a random item from an array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper to generate a random date between start and end
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate realistic sample data for expenses
export function generateSampleExpenses() {
  const now = new Date();
  const lastYear = subMonths(now, 18); // Go back 18 months to ensure we have last year data
  const expenses = [];
  
  // Common descriptions for each category
  const descriptions = {
    'Food & Dining': [
      'Grocery shopping', 'Dinner at restaurant', 'Coffee shop', 'Takeout food', 
      'Lunch at work', 'Supermarket', 'Bakery items', 'Fast food', 'Ice cream', 'Pizza delivery'
    ],
    'Transportation': [
      'Gas fill-up', 'Public transport pass', 'Uber ride', 'Taxi fare', 'Car maintenance', 
      'Oil change', 'Parking fee', 'Highway toll', 'Bike repair', 'Train ticket'
    ],
    'Utilities': [
      'Electricity bill', 'Water bill', 'Internet service', 'Phone bill', 'Gas utility', 
      'Trash service', 'Sewer bill', 'Cable TV', 'Streaming subscription', 'Home security'
    ],
    'Entertainment': [
      'Movie tickets', 'Concert tickets', 'Video game', 'Streaming subscription', 'Music service', 
      'Book purchase', 'Theme park', 'Sporting event', 'Theater tickets', 'Museum admission'
    ],
    'Shopping': [
      'Clothing purchase', 'Electronics', 'Home decor', 'Shoes', 'Accessories', 
      'Kitchen gadgets', 'Office supplies', 'Toiletries', 'Gift for friend', 'Beauty products'
    ],
    'Housing': [
      'Rent payment', 'Mortgage payment', 'Home insurance', 'Property tax', 'HOA fee', 
      'Furniture purchase', 'Home repair', 'Cleaning service', 'Lawn care', 'Home improvement'
    ],
    'Healthcare': [
      'Doctor visit', 'Prescription medication', 'Dentist appointment', 'Eye exam', 'Health insurance premium', 
      'Therapy session', 'Gym membership', 'Vitamins', 'Over-the-counter medicine', 'Medical test'
    ],
    'Education': [
      'Textbooks', 'Tuition payment', 'School supplies', 'Online course', 'Workshop fee', 
      'Certification exam', 'Student loan payment', 'Language app subscription', 'Reference books', 'Tutoring session'
    ]
  };
  
  // Specific stores or service providers for realistic descriptions
  const providers = {
    'Food & Dining': ['Whole Foods', 'Trader Joe\'s', 'Safeway', 'The Cheesecake Factory', 'Olive Garden', 'Chipotle', 'Starbucks', 'McDonald\'s', 'Subway', 'Local Cafe'],
    'Transportation': ['Shell', 'Chevron', 'Exxon', 'Lyft', 'Uber', 'Metro Transit', 'Amtrak', 'Jiffy Lube', 'Discount Tire', 'Enterprise'],
    'Utilities': ['Electric Company', 'Water Utility', 'Comcast', 'AT&T', 'Verizon', 'T-Mobile', 'DirectTV', 'Netflix', 'Spotify', 'Ring'],
    'Entertainment': ['AMC Theaters', 'Ticketmaster', 'Steam', 'Amazon Prime', 'Disney+', 'Kindle', 'Six Flags', 'StubHub', 'PlayStation Store', 'GameStop'],
    'Shopping': ['Amazon', 'Target', 'Walmart', 'Best Buy', 'Macy\'s', 'Nordstrom', 'Home Depot', 'IKEA', 'Apple Store', 'Nike'],
    'Housing': ['Apartment Rent', 'Mortgage', 'State Farm', 'City Property Tax', 'HOA', 'IKEA', 'Home Depot', 'Merry Maids', 'TruGreen', 'Lowe\'s'],
    'Healthcare': ['Primary Care', 'CVS Pharmacy', 'Dental Associates', 'Vision Center', 'Blue Cross', 'Therapy Group', 'Planet Fitness', 'GNC', 'Walgreens', 'Quest Diagnostics'],
    'Education': ['University Bookstore', 'University Bursar', 'Staples', 'Coursera', 'Udemy', 'CompTIA', 'Student Loan Servicer', 'Duolingo', 'Barnes & Noble', 'Tutoring Center']
  };
  
  // Categories with their frequency and amount ranges
  const categories = [
    { name: 'Food & Dining', frequency: 0.35, minAmount: 10, maxAmount: 200, seasonalFactor: month => 1 + (month === 11 ? 0.3 : 0) },
    { name: 'Transportation', frequency: 0.2, minAmount: 20, maxAmount: 150, seasonalFactor: month => 1 + (month >= 5 && month <= 8 ? 0.2 : 0) },
    { name: 'Utilities', frequency: 0.12, minAmount: 50, maxAmount: 300, seasonalFactor: month => 1 + (month <= 1 || month >= 11 ? 0.25 : (month >= 6 && month <= 8 ? 0.2 : 0)) },
    { name: 'Entertainment', frequency: 0.1, minAmount: 15, maxAmount: 120, seasonalFactor: month => 1 + (month >= 5 && month <= 8 ? 0.3 : 0) },
    { name: 'Shopping', frequency: 0.08, minAmount: 20, maxAmount: 500, seasonalFactor: month => 1 + (month === 11 ? 0.8 : (month === 0 ? 0.3 : 0)) },
    { name: 'Housing', frequency: 0.05, minAmount: 500, maxAmount: 2000, seasonalFactor: () => 1 },
    { name: 'Healthcare', frequency: 0.06, minAmount: 20, maxAmount: 400, seasonalFactor: month => 1 + (month <= 2 ? 0.15 : 0) },
    { name: 'Education', frequency: 0.04, minAmount: 30, maxAmount: 1000, seasonalFactor: month => 1 + (month === 7 || month === 8 || month === 0 ? 0.5 : 0) }
  ];

  // Calculate total frequency for normalization
  const totalFrequency = categories.reduce((sum, cat) => sum + cat.frequency, 0);
  
  // Generate 250-350 expenses
  const expenseCount = getRandomNumber(250, 350);
  
  // Create expense dates with proper distribution (more recent dates more frequent)
  const datesToUse = [];
  for (let i = 0; i < expenseCount; i++) {
    // Create a bias towards more recent dates using a weighted random approach
    const randomFactor = Math.pow(Math.random(), 0.5); // Creates a bias towards newer dates
    const date = new Date(lastYear.getTime() + randomFactor * (now.getTime() - lastYear.getTime()));
    
    // Ensure we don't have future dates
    if (date <= now) {
      datesToUse.push(date);
    } else {
      datesToUse.push(subDays(now, getRandomNumber(0, 5)));
    }
  }
  
  // Sort dates in descending order (newest first)
  datesToUse.sort((a, b) => b - a);
  
  // Generate expenses
  for (let i = 0; i < expenseCount; i++) {
    // Pick a date from our sorted array of dates
    const expenseDate = datesToUse[i];
    
    // Random selection of category based on frequency
    const randomValue = Math.random() * totalFrequency;
    let cumulativeFrequency = 0;
    let selectedCategory;
    
    for (const category of categories) {
      cumulativeFrequency += category.frequency;
      if (randomValue <= cumulativeFrequency) {
        selectedCategory = category;
        break;
      }
    }
    
    // Fallback to first category if something goes wrong
    if (!selectedCategory) selectedCategory = categories[0];
    
    // Get month for seasonal adjustments
    const month = getMonth(expenseDate);
    
    // Adjust amount range based on seasonal factors
    const seasonalMultiplier = selectedCategory.seasonalFactor(month);
    const adjustedMinAmount = selectedCategory.minAmount * seasonalMultiplier;
    const adjustedMaxAmount = selectedCategory.maxAmount * seasonalMultiplier;
    
    // Generate random amount with increased probability of common price points
    let amount;
    const priceType = Math.random();
    if (priceType < 0.3) {
      // Common price points (ending in .99, .50, .00)
      const baseAmount = getRandomNumber(Math.floor(adjustedMinAmount), Math.floor(adjustedMaxAmount));
      const cents = [0, 50, 99][getRandomNumber(0, 2)];
      amount = baseAmount + (cents / 100);
    } else {
      // Random price with two decimal places
      amount = parseFloat((Math.random() * (adjustedMaxAmount - adjustedMinAmount) + adjustedMinAmount).toFixed(2));
    }
    
    // Generate description
    const baseDescription = getRandomItem(descriptions[selectedCategory.name]);
    const provider = getRandomItem(providers[selectedCategory.name]);
    const description = Math.random() > 0.5 ? `${baseDescription} - ${provider}` : baseDescription;
    
    // Create the expense object
    expenses.push({
      id: crypto.randomUUID(),
      description,
      amount,
      category: selectedCategory.name,
      date: format(expenseDate, 'yyyy-MM-dd'),
      createdAt: expenseDate.toISOString()
    });
  }
  
  // Add a few recurring monthly expenses for stability
  const recurringCategories = ['Utilities', 'Housing', 'Entertainment'];
  recurringCategories.forEach(catName => {
    const category = categories.find(c => c.name === catName);
    if (!category) return;
    
    // Create a recurring description and amount
    const recurringDesc = `Monthly ${getRandomItem(descriptions[catName])} - ${getRandomItem(providers[catName])}`;
    const baseAmount = getRandomNumber(category.minAmount, category.maxAmount);
    
    // Add for the past 18 months
    for (let i = 0; i < 18; i++) {
      const monthDate = subMonths(now, i);
      const slightVariation = 1 + (Math.random() * 0.1 - 0.05); // +/- 5% variation
      const seasonalFactor = category.seasonalFactor(getMonth(monthDate));
      
      // Skip some months randomly (10% chance)
      if (Math.random() < 0.1) continue;
      
      expenses.push({
        id: crypto.randomUUID(),
        description: recurringDesc,
        amount: parseFloat((baseAmount * slightVariation * seasonalFactor).toFixed(2)),
        category: catName,
        date: format(new Date(getYear(monthDate), getMonth(monthDate), getRandomNumber(1, 10)), 'yyyy-MM-dd'),
        createdAt: monthDate.toISOString()
      });
    }
  });
  
  // Sort all expenses by date (newest first)
  return expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default generateSampleExpenses;