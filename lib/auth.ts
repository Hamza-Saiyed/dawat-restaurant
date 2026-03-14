import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const COOKIE_NAME = 'dawat_admin_token';
// 7 days in seconds
const MAX_AGE = 7 * 24 * 60 * 60;

export interface TokenPayload {
  adminId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): Promise<string> {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
  path: string;
}

export function getCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: MAX_AGE,
    path: '/',
  };
}

export async function setAuthCookie(token: string) {
  (await cookies()).set(COOKIE_NAME, token, getCookieOptions());
}

export async function clearAuthCookie() {
  (await cookies()).delete(COOKIE_NAME);
}


export async function getAdminPayload(): Promise<TokenPayload | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  return verifyToken(token);
}

/**
 * Extract token from a NextRequest's cookies (for use in API routes where
 * we receive the request directly, not from next/headers).
 */
export function getTokenFromRequest(req: { cookies: { get: (name: string) => { value: string } | undefined } }): string | null {
  return req.cookies.get(COOKIE_NAME)?.value || null;
}

export { COOKIE_NAME, MAX_AGE };
