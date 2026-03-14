// App-wide constants for Dawat Restaurant Backend

export const APP_NAME = 'Dawat Restaurant';
export const APP_VERSION = '2.0.0';

// Cookie configuration
export const COOKIE_NAME = 'dawat_admin_token';
export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

// JWT configuration
export const JWT_EXPIRY = '7d';

// Pagination defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

// Rate limit configurations
export const RATE_LIMITS = {
  'auth-login': {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 5,
    message: 'Too many login attempts. Try again in 15 minutes.',
    keyPrefix: 'rl:login:',
  },
  'reservation-create': {
    windowMs: 60 * 60 * 1000,  // 1 hour
    max: 3,
    message: 'Too many reservation requests.',
    keyPrefix: 'rl:reservation:',
  },
  'contact-form': {
    windowMs: 60 * 60 * 1000,  // 1 hour
    max: 5,
    message: 'Too many contact submissions.',
    keyPrefix: 'rl:contact:',
  },
  'api-general': {
    windowMs: 60 * 1000,       // 1 minute
    max: 60,
    message: 'Rate limit exceeded.',
    keyPrefix: 'rl:general:',
  },
  'admin-api': {
    windowMs: 60 * 1000,
    max: 200,
    message: 'Admin rate limit exceeded.',
    keyPrefix: 'rl:admin:',
  },
} as const;

// Cache TTL constants (seconds)
export const CACHE_TTL = {
  MENU: 60 * 60,          // 1 hour
  SETTINGS: 30 * 60,      // 30 minutes
  GALLERY: 60 * 60,       // 1 hour
  DASHBOARD: 5 * 60,      // 5 minutes
  REVIEWS: 15 * 60,       // 15 minutes
} as const;

// Reservation business rules
export const RESERVATION_RULES = {
  MAX_GUESTS: 20,
  MAX_ADVANCE_DAYS: 60,
  MIN_ADVANCE_MINUTES: 60, // must book at least 1hr ahead for same-day
  OPENING_HOUR: 11,        // 11 AM
  CLOSING_HOUR_MINUTES: 24 * 60 + 30, // 12:30 AM next day (in minutes)
} as const;

// Valid reservation time slots
export const VALID_TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
  '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
  '21:30', '22:00', '22:30', '23:00', '23:30', '00:00', '00:30',
] as const;

// Menu categories
export const MENU_CATEGORIES = [
  'starters', 'main-course', 'biryani', 'tandoor', 'desserts', 'beverages',
] as const;

// Gallery categories
export const GALLERY_CATEGORIES = ['food', 'interior', 'events', 'team'] as const;

// Review platforms
export const REVIEW_PLATFORMS = ['website', 'google', 'zomato', 'swiggy', 'manual'] as const;

// Admin roles
export const ADMIN_ROLES = ['super_admin', 'admin', 'staff'] as const;

// Activity log actions
export const ACTIVITY_ACTIONS = [
  'RESERVATION_APPROVED', 'RESERVATION_REJECTED', 'RESERVATION_COMPLETED', 'RESERVATION_DELETED',
  'MENU_ITEM_CREATED', 'MENU_ITEM_UPDATED', 'MENU_ITEM_DELETED', 'MENU_ITEM_TOGGLED',
  'GALLERY_IMAGE_UPLOADED', 'GALLERY_IMAGE_DELETED', 'GALLERY_REORDERED',
  'REVIEW_APPROVED', 'REVIEW_REJECTED', 'REVIEW_DELETED',
  'MESSAGE_READ', 'MESSAGE_ARCHIVED', 'MESSAGE_DELETED',
  'SETTINGS_UPDATED', 'HERO_UPDATED', 'SOCIAL_LINKS_UPDATED',
  'ADMIN_LOGIN', 'ADMIN_LOGOUT', 'PASSWORD_CHANGED',
] as const;

// Restaurant info
export const RESTAURANT = {
  name: 'Dawat Restaurant',
  tagline: 'Authentic North Indian Cuisine',
  phone: '+91 99040 43204',
  address: 'First Floor, Shop No. 2, near HK Travels, opposite Honda Showroom, Vishala Circle, Ahmedabad, Gujarat 380055',
  googleMapsUrl: 'https://maps.google.com/?q=Dawat+Restaurant+Vishala+Circle+Ahmedabad',
} as const;
