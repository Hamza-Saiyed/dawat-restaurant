// Date validation helper utilities

/**
 * Check if a date string is a valid, parseable date.
 */
export function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Get start and end of a given day (UTC boundaries).
 */
export function getDayBounds(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/**
 * Check if a date is today or in the future.
 */
export function isTodayOrFuture(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate >= today;
}

/**
 * Check if a date is within maxDays from today.
 */
export function isWithinMaxDays(date: Date, maxDays: number): boolean {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + maxDays);
  maxDate.setHours(23, 59, 59, 999);
  return date <= maxDate;
}

/**
 * Check if a date is today.
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Parse a time string (HH:MM) to total minutes since midnight.
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Format date for display in emails (e.g., "Monday, 15 January 2024").
 */
export function formatDateForEmail(date: Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
