export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

/**
 * Get the day of week string from a Date object.
 * @param {Date} date
 * @returns {string} e.g. "Monday"
 */
export const getDayOfWeekString = (date) => {
  return DAYS_OF_WEEK[date.getDay()];
};

/**
 * Format a Date object as HH:MM.
 * @param {Date} date
 * @returns {string} e.g. "09:00"
 */
export const formatTimeHHMM = (date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};
