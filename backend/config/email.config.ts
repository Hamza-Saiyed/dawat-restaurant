// Email (SMTP) configuration

export const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
};

export const emailDefaults = {
  from: `"Dawat Restaurant" <${process.env.SMTP_USER || 'noreply@dawatrestaurant.com'}>`,
  restaurantEmail: process.env.RESTAURANT_EMAIL || '',
};

export function isEmailConfigured(): boolean {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
}
