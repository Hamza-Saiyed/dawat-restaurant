// CORS configuration

const allowedOrigins = [
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  'https://dawatrestaurant.com',
  'https://www.dawatrestaurant.com',
];

export function corsHeaders(origin?: string | null): Record<string, string> {
  const isAllowed = origin && allowedOrigins.some(o =>
    o === origin || origin.endsWith('.vercel.app')
  );

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin! : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

export const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googleapis.com",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "font-src 'self' fonts.gstatic.com",
      "img-src 'self' data: blob: res.cloudinary.com images.unsplash.com",
      "connect-src 'self' *.mongodb.net",
      "frame-src *.google.com",
    ].join('; '),
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];
