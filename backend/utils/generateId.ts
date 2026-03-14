// Confirmation ID generator for reservations

/**
 * Generates a unique confirmation ID in the format DWT-XXXXXX.
 * Uses timestamp + random characters for uniqueness.
 */
export function generateConfirmationId(): string {
  const timestampPart = Date.now().toString(36).toUpperCase().slice(-4);
  const randomPart = Math.random().toString(36).slice(-2).toUpperCase();
  return `DWT-${timestampPart}${randomPart}`;
}
