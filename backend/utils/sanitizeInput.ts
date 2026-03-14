// Input sanitization utilities — prevent NoSQL injection

/**
 * Recursively sanitize unknown input to prevent NoSQL injection.
 * Strips MongoDB operators ($ prefix) and dots from keys.
 */
export function sanitizeInput(data: unknown): unknown {
  if (typeof data === 'string') {
    return data.replace(/[$]/g, '').trim();
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }

  if (data !== null && typeof data === 'object' && !(data instanceof Date)) {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      // Reject keys starting with $ or containing .
      if (key.startsWith('$') || key.includes('.')) continue;
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }

  return data;
}

/**
 * Sanitize a parsed request body object.
 */
export function sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
  return sanitizeInput(body) as Record<string, unknown>;
}
