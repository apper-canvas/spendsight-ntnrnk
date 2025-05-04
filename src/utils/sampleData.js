import { subDays, subMonths, format, getMonth, getYear, startOfMonth, endOfMonth } from 'date-fns';

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

// Generate specific expenses for this month last year
function generateLastYearMonthExpenses(currentExpenses, startId) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const lastYearValue = now.getFullYear() - 1;
  
  // Create date range for the same month last year
  const startOfLastYearSameMonth = startOfMonth(new Date(lastYearValue, currentMonth, 1));
  const endOfLastYearSameMonth = endOfMonth(new Date(lastYearValue, currentMonth, 1));
  
  // Common descriptions for each category
  const descriptions = {
    'Food & Dining': [
      'Grocery shopping', 'Dinner at restaurant', 'Coffee shop', 'Takeout food', 
      'Lunch at work', 'Supermarket', 'Bakery items', 'Fast food', 'Ice cream', 'Pizza delivery',
      'Snacks', 'Food delivery', 'Brunch', 'Food truck', 'Office lunch order', 'Breakfast', 
      'Weekly groceries', 'Monthly bulk shopping', 'Holiday dinner', 'Special occasion meal'
    ],
    'Transportation': [
      'Gas fill-up', 'Public transport pass', 'Uber ride', 'Taxi fare', 'Car maintenance', 
      'Oil change', 'Parking fee', 'Highway toll', 'Bike repair', 'Train ticket',
      'Car wash', 'Vehicle registration', 'Tire replacement', 'Car insurance', 'Bus ticket',
      'Subway pass', 'Airport shuttle', 'Rental car', 'Battery replacement', 'Car service'
    ],
    'Utilities': [
      'Electricity bill', 'Water bill', 'Internet service', 'Phone bill', 'Gas utility', 
      'Trash service', 'Sewer bill', 'Cable TV', 'Streaming subscription', 'Home security',
      'Solar panel lease', 'VPN service', 'Cloud storage', 'Smart home subscription', 'Internet upgrade',
      'Mobile data plan', 'Landline service', 'Sewage charge', 'Water delivery', 'Satellite TV'
    ],
    'Entertainment': [
      'Movie tickets', 'Concert tickets', 'Video game', 'Streaming subscription', 'Music service', 
      'Book purchase', 'Theme park', 'Sporting event', 'Theater tickets', 'Museum admission',
      'App purchase', 'Magazine subscription', 'Board game', 'Live show', 'Cinema snacks',
      'Bowling night', 'Arcade games', 'Online event ticket', 'Gaming subscription', 'Festival entry'
    ],
    'Shopping': [
      'Clothing purchase', 'Electronics', 'Home decor', 'Shoes', 'Accessories', 
      'Kitchen gadgets', 'Office supplies', 'Toiletries', 'Gift for friend', 'Beauty products',
      'Furniture', 'Smartphone accessories', 'Household items', 'Tools', 'Athletic equipment',
      'Outdoor gear', 'Seasonal decorations', 'Appliance', 'Computer accessories', 'Hobby supplies'
    ],
    'Housing': [
      'Rent payment', 'Mortgage payment', 'Home insurance', 'Property tax', 'HOA fee', 
      'Furniture purchase', 'Home repair', 'Cleaning service', 'Lawn care', 'Home improvement',
      'Renters insurance', 'Pest control', 'Plumbing repair', 'HVAC maintenance', 'Security system',
      'Window cleaning', 'Carpet cleaning', 'Roof repair', 'Painting service', 'Home décor'
    ],
    'Healthcare': [
      'Doctor visit', 'Prescription medication', 'Dentist appointment', 'Eye exam', 'Health insurance premium', 
      'Therapy session', 'Gym membership', 'Vitamins', 'Over-the-counter medicine', 'Medical test',
      'Specialist consultation', 'Urgent care visit', 'Dental cleaning', 'New glasses', 'Contact lenses',
      'Physical therapy', 'Nutritionist', 'Chiropractor', 'Medical device', 'Health supplements'
    ],
    'Education': [
      'Textbooks', 'Tuition payment', 'School supplies', 'Online course', 'Workshop fee', 
      'Certification exam', 'Student loan payment', 'Language app subscription', 'Reference books', 'Tutoring session',
      'Professional development', 'Conference fee', 'Education software', 'School uniform', 'Laboratory fee',
      'Research materials', 'Education hardware', 'Art supplies', 'Student association fee', 'Study materials'
    ]
  };
  
  // Specific stores or service providers for realistic descriptions
  const providers = {
    'Food & Dining': ['Whole Foods', 'Trader Joe\'s', 'Safeway', 'The Cheesecake Factory', 'Olive Garden', 'Chipotle', 'Starbucks', 'McDonald\'s', 'Subway', 'Local Cafe', 'Kroger', 'Aldi', 'Costco', 'Panera Bread', 'Taco Bell', 'KFC', 'Wendy\'s', 'Domino\'s Pizza', 'Papa John\'s', 'Burger King'],
    'Transportation': ['Shell', 'Chevron', 'Exxon', 'Lyft', 'Uber', 'Metro Transit', 'Amtrak', 'Jiffy Lube', 'Discount Tire', 'Enterprise', 'Hertz', 'National', 'BP', 'Valvoline', 'Greyhound', 'Southwest Airlines', 'Delta Airlines', 'American Airlines', 'Midas', 'Goodyear'],
    'Utilities': ['Electric Company', 'Water Utility', 'Comcast', 'AT&T', 'Verizon', 'T-Mobile', 'DirectTV', 'Netflix', 'Spotify', 'Ring', 'Hulu', 'YouTube Premium', 'Disney+', 'Apple Music', 'Amazon Prime', 'Cox Cable', 'Charter', 'CenturyLink', 'Dropbox', 'NordVPN'],
    'Entertainment': ['AMC Theaters', 'Ticketmaster', 'Steam', 'Amazon Prime', 'Disney+', 'Kindle', 'Six Flags', 'StubHub', 'PlayStation Store', 'GameStop', 'Regal Cinemas', 'Epic Games', 'Fandango', 'HBO Max', 'Universal Studios', 'Live Nation', 'Xbox Store', 'Nintendo eShop', 'Barnes & Noble', 'Local Theater'],
    'Shopping': ['Amazon', 'Target', 'Walmart', 'Best Buy', 'Macy\'s', 'Nordstrom', 'Home Depot', 'IKEA', 'Apple Store', 'Nike', 'Costco', 'TJ Maxx', 'Kohl\'s', 'Old Navy', 'Lowe\'s', 'Bed Bath & Beyond', 'Ross', 'Gap', 'Office Depot', 'Staples'],
    'Housing': ['Apartment Rent', 'Mortgage', 'State Farm', 'City Property Tax', 'HOA', 'IKEA', 'Home Depot', 'Merry Maids', 'TruGreen', 'Lowe\'s', 'Progressive Insurance', 'Condo Association', 'Allstate', 'Apartment Insurance', 'Stanley Steemer', 'ADT', 'Terminix', 'Roto-Rooter', 'Sherwin Williams', 'American Home Shield'],
    'Healthcare': ['Primary Care', 'CVS Pharmacy', 'Dental Associates', 'Vision Center', 'Blue Cross', 'Therapy Group', 'Planet Fitness', 'GNC', 'Walgreens', 'Quest Diagnostics', 'UnitedHealthcare', 'Kaiser Permanente', 'Rite Aid', 'LensCrafters', 'LA Fitness', 'Life Time Fitness', 'Humana', 'Aetna', 'Cigna', 'Gold\'s Gym'],
    'Education': ['University Bookstore', 'University Bursar', 'Staples', 'Coursera', 'Udemy', 'CompTIA', 'Student Loan Servicer', 'Duolingo', 'Barnes & Noble', 'Tutoring Center', 'edX', 'LinkedIn Learning', 'College Board', 'Pearson', 'Private Tutor', 'Khan Academy Plus', 'Skillshare', 'Rosetta Stone', 'Navient', 'Sallie Mae']
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

  // Last year month specific expenses
  const lastYearExpenses = [];
  let nextId = startId;
  
  // Generate 30-40 expenses for this month last year (more than usual)
  const expenseCount = getRandomNumber(30, 40);
  
  // Create dates spread across the month
  const daysInMonth = endOfLastYearSameMonth.getDate();
  const datesInMonth = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    datesInMonth.push(new Date(lastYearValue, currentMonth, day));
  }
  
  // Shuffle dates to distribute them randomly
  const shuffledDates = [...datesInMonth].sort(() => 0.5 - Math.random());
  const datesToUse = shuffledDates.slice(0, expenseCount);
  
  // Sort dates chronologically
  datesToUse.sort((a, b) => a - b);
  
  // Generate expenses for each date
  datesToUse.forEach(expenseDate => {
    // Calculate the number of expenses for this date (1-3)
    const numExpensesForDate = getRandomNumber(1, 3);
    
    for (let i = 0; i < numExpensesForDate; i++) {
      // Pick a random category with weighted probabilities
      const randomValue = Math.random();
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
      
      // Adjust amount range based on seasonal factors
      const seasonalMultiplier = selectedCategory.seasonalFactor(currentMonth);
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
      
      // Create tags for some expenses (about 30% of them)
      let tags = [];
      if (Math.random() < 0.3) {
        // Possible tags
        const possibleTags = [
          'Work Related', 'Personal', 'Family', 'Vacation', 'Emergency', 
          'Recurring', 'One-time', 'Necessary', 'Splurge', 'Gift', 
          'Reimbursable', 'Tax Deductible', 'Investment'
        ];
        
        // Add 1-3 random tags
        const tagCount = getRandomNumber(1, 3);
        const shuffledTags = [...possibleTags].sort(() => 0.5 - Math.random());
        tags = shuffledTags.slice(0, tagCount);
      }
      
      // Ensure this doesn't duplicate with existing expenses
      const isDuplicate = currentExpenses.some(
        e => e.description === description && 
        Math.abs(e.amount - amount) < 0.01 && 
        e.category === selectedCategory.name
      );
      
      if (!isDuplicate) {
        // Create the expense object with appropriate date from last year
        lastYearExpenses.push({
          id: nextId,
          Id: nextId,
          Name: description.substring(0, Math.min(description.length, 20)) + (description.length > 20 ? '...' : ''),
          description,
          amount,
          category: selectedCategory.name,
          date: format(expenseDate, 'yyyy-MM-dd'),
          Tags: tags.join(','),
          CreatedOn: expenseDate.toISOString(),
          ModifiedOn: expenseDate.toISOString(),
          Owner: "Current User",
          CreatedBy: "Current User",
          ModifiedBy: "Current User",
          IsDeleted: false,
          InSandbox: false
        });
        
        nextId++;
      }
    }
  });
  
  // Add some recurring expenses specifically for this month last year
  const recurringCategories = ['Utilities', 'Housing', 'Entertainment', 'Food & Dining'];
  recurringCategories.forEach(catName => {
    const category = categories.find(c => c.name === catName);
    if (!category) return;
    
    // Add 2-3 recurring expenses for this month last year
    const numRecurring = getRandomNumber(2, 3);
    
    for (let j = 0; j < numRecurring; j++) {
      // Create a recurring description and amount
      const recurringDesc = `Monthly ${getRandomItem(descriptions[catName])} - ${getRandomItem(providers[catName])}`;
      const baseAmount = getRandomNumber(category.minAmount, category.maxAmount);
      
      // Add for this specific month last year
      const monthDate = new Date(lastYearValue, currentMonth, getRandomNumber(5, 25));
      const slightVariation = 1 + (Math.random() * 0.1 - 0.05); // +/- 5% variation
      const seasonalFactor = category.seasonalFactor(currentMonth);
      
      // Create the recurring expense
      lastYearExpenses.push({
        id: nextId,
        Id: nextId,
        Name: recurringDesc.substring(0, Math.min(recurringDesc.length, 20)) + (recurringDesc.length > 20 ? '...' : ''),
        description: recurringDesc,
        amount: parseFloat((baseAmount * slightVariation * seasonalFactor).toFixed(2)),
        category: catName,
        date: format(monthDate, 'yyyy-MM-dd'),
        Tags: 'Recurring,Monthly',
        CreatedOn: monthDate.toISOString(),
        ModifiedOn: monthDate.toISOString(),
        Owner: "Current User",
        CreatedBy: "Current User",
        ModifiedBy: "Current User",
        IsDeleted: false,
        InSandbox: false
      });
      
      nextId++;
    }
  });
  
  // Add a couple of special/one-time expenses for this month last year
  const specialEvents = [
    { name: "Annual Insurance Premium", category: "Housing", multiplier: 12 },
    { name: "Vacation Package", category: "Entertainment", multiplier: 10 },
    { name: "New Smartphone", category: "Shopping", multiplier: 8 },
    { name: "Car Repair", category: "Transportation", multiplier: 6 }
  ];
  
  // Add 1-2 special events for this month last year
  const numSpecialEvents = getRandomNumber(1, 2);
  const shuffledEvents = [...specialEvents].sort(() => 0.5 - Math.random());
  const eventsToAdd = shuffledEvents.slice(0, numSpecialEvents);
  
  eventsToAdd.forEach(event => {
    const category = categories.find(c => c.name === event.category);
    if (!category) return;
    
    const eventDate = new Date(lastYearValue, currentMonth, getRandomNumber(5, 25));
    const baseAmount = category.maxAmount * event.multiplier;
    const finalAmount = baseAmount + (Math.random() * baseAmount * 0.2 - baseAmount * 0.1); // +/- 10%
    
    const provider = getRandomItem(providers[event.category]);
    const description = `${event.name} - ${provider}`;
    
    lastYearExpenses.push({
      id: nextId,
      Id: nextId,
      Name: description.substring(0, Math.min(description.length, 20)) + (description.length > 20 ? '...' : ''),
      description,
      amount: parseFloat(finalAmount.toFixed(2)),
      category: event.category,
      date: format(eventDate, 'yyyy-MM-dd'),
      Tags: 'High Value,Annual',
      CreatedOn: eventDate.toISOString(),
      ModifiedOn: eventDate.toISOString(),
      Owner: "Current User",
      CreatedBy: "Current User",
      ModifiedBy: "Current User",
      IsDeleted: false,
      InSandbox: false
    });
    
    nextId++;
  });
  
  return lastYearExpenses;
}

// Generate realistic sample data for expenses
export function generateSampleExpenses() {
  const now = new Date();
  const lastYear = subMonths(now, 24); // Go back 24 months to ensure we have more history
  const expenses = [];
  
  // Common descriptions for each category
  const descriptions = {
    'Food & Dining': [
      'Grocery shopping', 'Dinner at restaurant', 'Coffee shop', 'Takeout food', 
      'Lunch at work', 'Supermarket', 'Bakery items', 'Fast food', 'Ice cream', 'Pizza delivery',
      'Snacks', 'Food delivery', 'Brunch', 'Food truck', 'Office lunch order', 'Breakfast', 
      'Weekly groceries', 'Monthly bulk shopping', 'Holiday dinner', 'Special occasion meal'
    ],
    'Transportation': [
      'Gas fill-up', 'Public transport pass', 'Uber ride', 'Taxi fare', 'Car maintenance', 
      'Oil change', 'Parking fee', 'Highway toll', 'Bike repair', 'Train ticket',
      'Car wash', 'Vehicle registration', 'Tire replacement', 'Car insurance', 'Bus ticket',
      'Subway pass', 'Airport shuttle', 'Rental car', 'Battery replacement', 'Car service'
    ],
    'Utilities': [
      'Electricity bill', 'Water bill', 'Internet service', 'Phone bill', 'Gas utility', 
      'Trash service', 'Sewer bill', 'Cable TV', 'Streaming subscription', 'Home security',
      'Solar panel lease', 'VPN service', 'Cloud storage', 'Smart home subscription', 'Internet upgrade',
      'Mobile data plan', 'Landline service', 'Sewage charge', 'Water delivery', 'Satellite TV'
    ],
    'Entertainment': [
      'Movie tickets', 'Concert tickets', 'Video game', 'Streaming subscription', 'Music service', 
      'Book purchase', 'Theme park', 'Sporting event', 'Theater tickets', 'Museum admission',
      'App purchase', 'Magazine subscription', 'Board game', 'Live show', 'Cinema snacks',
      'Bowling night', 'Arcade games', 'Online event ticket', 'Gaming subscription', 'Festival entry'
    ],
    'Shopping': [
      'Clothing purchase', 'Electronics', 'Home decor', 'Shoes', 'Accessories', 
      'Kitchen gadgets', 'Office supplies', 'Toiletries', 'Gift for friend', 'Beauty products',
      'Furniture', 'Smartphone accessories', 'Household items', 'Tools', 'Athletic equipment',
      'Outdoor gear', 'Seasonal decorations', 'Appliance', 'Computer accessories', 'Hobby supplies'
    ],
    'Housing': [
      'Rent payment', 'Mortgage payment', 'Home insurance', 'Property tax', 'HOA fee', 
      'Furniture purchase', 'Home repair', 'Cleaning service', 'Lawn care', 'Home improvement',
      'Renters insurance', 'Pest control', 'Plumbing repair', 'HVAC maintenance', 'Security system',
      'Window cleaning', 'Carpet cleaning', 'Roof repair', 'Painting service', 'Home décor'
    ],
    'Healthcare': [
      'Doctor visit', 'Prescription medication', 'Dentist appointment', 'Eye exam', 'Health insurance premium', 
      'Therapy session', 'Gym membership', 'Vitamins', 'Over-the-counter medicine', 'Medical test',
      'Specialist consultation', 'Urgent care visit', 'Dental cleaning', 'New glasses', 'Contact lenses',
      'Physical therapy', 'Nutritionist', 'Chiropractor', 'Medical device', 'Health supplements'
    ],
    'Education': [
      'Textbooks', 'Tuition payment', 'School supplies', 'Online course', 'Workshop fee', 
      'Certification exam', 'Student loan payment', 'Language app subscription', 'Reference books', 'Tutoring session',
      'Professional development', 'Conference fee', 'Education software', 'School uniform', 'Laboratory fee',
      'Research materials', 'Education hardware', 'Art supplies', 'Student association fee', 'Study materials'
    ]
  };
  
  // Specific stores or service providers for realistic descriptions
  const providers = {
    'Food & Dining': ['Whole Foods', 'Trader Joe\'s', 'Safeway', 'The Cheesecake Factory', 'Olive Garden', 'Chipotle', 'Starbucks', 'McDonald\'s', 'Subway', 'Local Cafe', 'Kroger', 'Aldi', 'Costco', 'Panera Bread', 'Taco Bell', 'KFC', 'Wendy\'s', 'Domino\'s Pizza', 'Papa John\'s', 'Burger King'],
    'Transportation': ['Shell', 'Chevron', 'Exxon', 'Lyft', 'Uber', 'Metro Transit', 'Amtrak', 'Jiffy Lube', 'Discount Tire', 'Enterprise', 'Hertz', 'National', 'BP', 'Valvoline', 'Greyhound', 'Southwest Airlines', 'Delta Airlines', 'American Airlines', 'Midas', 'Goodyear'],
    'Utilities': ['Electric Company', 'Water Utility', 'Comcast', 'AT&T', 'Verizon', 'T-Mobile', 'DirectTV', 'Netflix', 'Spotify', 'Ring', 'Hulu', 'YouTube Premium', 'Disney+', 'Apple Music', 'Amazon Prime', 'Cox Cable', 'Charter', 'CenturyLink', 'Dropbox', 'NordVPN'],
    'Entertainment': ['AMC Theaters', 'Ticketmaster', 'Steam', 'Amazon Prime', 'Disney+', 'Kindle', 'Six Flags', 'StubHub', 'PlayStation Store', 'GameStop', 'Regal Cinemas', 'Epic Games', 'Fandango', 'HBO Max', 'Universal Studios', 'Live Nation', 'Xbox Store', 'Nintendo eShop', 'Barnes & Noble', 'Local Theater'],
    'Shopping': ['Amazon', 'Target', 'Walmart', 'Best Buy', 'Macy\'s', 'Nordstrom', 'Home Depot', 'IKEA', 'Apple Store', 'Nike', 'Costco', 'TJ Maxx', 'Kohl\'s', 'Old Navy', 'Lowe\'s', 'Bed Bath & Beyond', 'Ross', 'Gap', 'Office Depot', 'Staples'],
    'Housing': ['Apartment Rent', 'Mortgage', 'State Farm', 'City Property Tax', 'HOA', 'IKEA', 'Home Depot', 'Merry Maids', 'TruGreen', 'Lowe\'s', 'Progressive Insurance', 'Condo Association', 'Allstate', 'Apartment Insurance', 'Stanley Steemer', 'ADT', 'Terminix', 'Roto-Rooter', 'Sherwin Williams', 'American Home Shield'],
    'Healthcare': ['Primary Care', 'CVS Pharmacy', 'Dental Associates', 'Vision Center', 'Blue Cross', 'Therapy Group', 'Planet Fitness', 'GNC', 'Walgreens', 'Quest Diagnostics', 'UnitedHealthcare', 'Kaiser Permanente', 'Rite Aid', 'LensCrafters', 'LA Fitness', 'Life Time Fitness', 'Humana', 'Aetna', 'Cigna', 'Gold\'s Gym'],
    'Education': ['University Bookstore', 'University Bursar', 'Staples', 'Coursera', 'Udemy', 'CompTIA', 'Student Loan Servicer', 'Duolingo', 'Barnes & Noble', 'Tutoring Center', 'edX', 'LinkedIn Learning', 'College Board', 'Pearson', 'Private Tutor', 'Khan Academy Plus', 'Skillshare', 'Rosetta Stone', 'Navient', 'Sallie Mae']
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
  
  // Generate 500-600 expenses (increased from 250-350)
  const expenseCount = getRandomNumber(500, 600);
  
  // Create expense dates with proper distribution (more recent dates more frequent)
  const datesToUse = [];
  for (let i = 0; i < expenseCount; i++) {
    // Create a bias towards more recent dates using a weighted random approach
    const randomFactor = Math.pow(Math.random(), 1.5); // Stronger bias towards newer dates
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
    
    // Create tags for some expenses (about 30% of them)
    let tags = [];
    if (Math.random() < 0.3) {
      // Possible tags
      const possibleTags = [
        'Work Related', 'Personal', 'Family', 'Vacation', 'Emergency', 
        'Recurring', 'One-time', 'Necessary', 'Splurge', 'Gift', 
        'Reimbursable', 'Tax Deductible', 'Investment'
      ];
      
      // Add 1-3 random tags
      const tagCount = getRandomNumber(1, 3);
      const shuffledTags = [...possibleTags].sort(() => 0.5 - Math.random());
      tags = shuffledTags.slice(0, tagCount);
    }
    
    // Create the expense object
    const expenseId = i + 1; // Using sequential IDs instead of UUIDs for consistency
    
    expenses.push({
      id: expenseId,
      Id: expenseId, // Adding Id field to match Apper schema
      Name: description.substring(0, Math.min(description.length, 20)) + (description.length > 20 ? '...' : ''),
      description,
      amount,
      category: selectedCategory.name,
      date: format(expenseDate, 'yyyy-MM-dd'),
      Tags: tags.join(','),
      CreatedOn: expenseDate.toISOString(),
      ModifiedOn: expenseDate.toISOString(),
      Owner: "Current User",
      CreatedBy: "Current User",
      ModifiedBy: "Current User",
      IsDeleted: false,
      InSandbox: false
    });
  }
  
  // Add recurring monthly expenses for stability
  const recurringCategories = ['Utilities', 'Housing', 'Entertainment', 'Food & Dining'];
  recurringCategories.forEach(catName => {
    const category = categories.find(c => c.name === catName);
    if (!category) return;
    
    // Add 2-3 recurring expenses per category for more data
    const numRecurring = getRandomNumber(2, 3);
    
    for (let j = 0; j < numRecurring; j++) {
      // Create a recurring description and amount
      const recurringDesc = `Monthly ${getRandomItem(descriptions[catName])} - ${getRandomItem(providers[catName])}`;
      const baseAmount = getRandomNumber(category.minAmount, category.maxAmount);
      
      // Add for the past 24 months
      for (let i = 0; i < 24; i++) {
        const monthDate = subMonths(now, i);
        const slightVariation = 1 + (Math.random() * 0.1 - 0.05); // +/- 5% variation
        const seasonalFactor = category.seasonalFactor(getMonth(monthDate));
        
        // Skip some months randomly (10% chance)
        if (Math.random() < 0.1) continue;
        
        const expenseId = expenses.length + 1;
        
        expenses.push({
          id: expenseId,
          Id: expenseId, // Adding Id field to match Apper schema
          Name: recurringDesc.substring(0, Math.min(recurringDesc.length, 20)) + (recurringDesc.length > 20 ? '...' : ''),
          description: recurringDesc,
          amount: parseFloat((baseAmount * slightVariation * seasonalFactor).toFixed(2)),
          category: catName,
          date: format(new Date(getYear(monthDate), getMonth(monthDate), getRandomNumber(1, 10)), 'yyyy-MM-dd'),
          Tags: 'Recurring,Monthly',
          CreatedOn: monthDate.toISOString(),
          ModifiedOn: monthDate.toISOString(),
          Owner: "Current User",
          CreatedBy: "Current User",
          ModifiedBy: "Current User",
          IsDeleted: false,
          InSandbox: false
        });
      }
    }
  });
  
  // Add some special high-value expenses
  const specialEvents = [
    { name: "Annual Insurance Premium", category: "Housing", multiplier: 12 },
    { name: "Vacation Package", category: "Entertainment", multiplier: 10 },
    { name: "New Smartphone", category: "Shopping", multiplier: 8 },
    { name: "Car Repair", category: "Transportation", multiplier: 6 },
    { name: "Medical Procedure", category: "Healthcare", multiplier: 8 },
    { name: "College Tuition Payment", category: "Education", multiplier: 15 }
  ];
  
  // Add one of each special event every year
  for (let year = 0; year <= 1; year++) {
    for (const event of specialEvents) {
      const category = categories.find(c => c.name === event.category);
      if (!category) continue;
      
      const eventDate = subMonths(now, getRandomNumber(year * 12, year * 12 + 11));
      const baseAmount = category.maxAmount * event.multiplier;
      const finalAmount = baseAmount + (Math.random() * baseAmount * 0.2 - baseAmount * 0.1); // +/- 10%
      
      const expenseId = expenses.length + 1;
      const provider = getRandomItem(providers[event.category]);
      const description = `${event.name} - ${provider}`;
      
      expenses.push({
        id: expenseId,
        Id: expenseId, // Adding Id field to match Apper schema
        Name: description.substring(0, Math.min(description.length, 20)) + (description.length > 20 ? '...' : ''),
        description,
        amount: parseFloat(finalAmount.toFixed(2)),
        category: event.category,
        date: format(eventDate, 'yyyy-MM-dd'),
        Tags: 'High Value,Annual',
        CreatedOn: eventDate.toISOString(),
        ModifiedOn: eventDate.toISOString(),
        Owner: "Current User",
        CreatedBy: "Current User",
        ModifiedBy: "Current User",
        IsDeleted: false,
        InSandbox: false
      });
    }
  }
  
  // Generate additional expenses specifically for this month last year
  const lastYearMonthExpenses = generateLastYearMonthExpenses(expenses, expenses.length + 1);
  
  // Add these specific expenses to the main expenses array
  expenses.push(...lastYearMonthExpenses);
  
  // Sort all expenses by date (newest first)
  return expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default generateSampleExpenses;