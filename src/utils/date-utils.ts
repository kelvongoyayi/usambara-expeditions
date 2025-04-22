/**
 * Utility functions for date operations
 */

/**
 * Format a date from ISO string to localized string
 * 
 * @param dateString ISO date string to format
 * @param options Formatting options
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string, 
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a date range from two ISO date strings
 * 
 * @param startDateString Start date ISO string
 * @param endDateString End date ISO string
 * @returns Formatted date range string
 */
export const formatDateRange = (startDateString: string, endDateString: string): string => {
  try {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    
    // If same day, just return one date
    if (startDate.toDateString() === endDate.toDateString()) {
      return formatDate(startDateString);
    }
    
    // If same month and year, format like "January 1-15, 2023"
    if (
      startDate.getMonth() === endDate.getMonth() && 
      startDate.getFullYear() === endDate.getFullYear()
    ) {
      return `${startDate.toLocaleDateString('en-US', { month: 'long' })} ${startDate.getDate()}-${endDate.getDate()}, ${endDate.getFullYear()}`;
    }
    
    // Different months, format fully
    return `${formatDate(startDateString)} - ${formatDate(endDateString)}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    return `${startDateString} - ${endDateString}`;
  }
};

/**
 * Get month name from a month number (0-11)
 * 
 * @param monthNumber Month number (0-11)
 * @returns Month name
 */
export const getMonthName = (monthNumber: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return months[monthNumber];
};

/**
 * Calculate the difference in days between two dates
 * 
 * @param startDate First date
 * @param endDate Second date
 * @returns Number of days between the dates
 */
export const daysBetween = (startDate: Date, endDate: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / oneDay));
  return diffDays;
};

/**
 * Check if a date is in the past
 * 
 * @param date Date to check
 * @returns True if the date is in the past
 */
export const isDatePast = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Get today's date as an ISO string (date part only)
 * 
 * @returns Today's date as YYYY-MM-DD
 */
export const getTodayISOString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Add days to a date
 * 
 * @param date The base date
 * @param days Number of days to add
 * @returns New date with days added
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Get a list of months between two dates
 * 
 * @param startDate Start date
 * @param endDate End date
 * @returns Array of month strings in "YYYY-MM" format
 */
export const getMonthsBetween = (startDate: Date, endDate: Date): string[] => {
  const months: string[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    months.push(`${year}-${month}`);
    
    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return months;
};