// Auth controller — handles login/logout/verify

import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/backend/services/auth.service';
import { validateBody } from '@/backend/middlewares/validate.middleware';
import { createRateLimit, getClientIP } from '@/backend/middlewares/rateLimit.middleware';
import { LoginSchema } from '@/backend/validators/auth.validator';
import { COOKIE_NAME, getCookieOptions, getAdminPayload } from '@/lib/auth';

import { ApiResponse } from '@/backend/utils/apiResponse';

const authService = new AuthService();

export class AuthController {
  async login(req: NextRequest): Promise<NextResponse> {
    // Rate limit
    const rateLimitResult = await createRateLimit('auth-login')(req);
    if (rateLimitResult) return rateLimitResult;

    // Validate
    const data = await validateBody(req, LoginSchema);

    // Login
    const ip = getClientIP(req);
    const result = await authService.login(data.email, data.password, ip);

    // Build response using NextResponse directly — do NOT use ApiResponse wrapper here
    // because custom wrappers can lose cookie headers
    const response = NextResponse.json(
      { success: true, message: 'Login successful', data: { admin: result.admin } },
      { status: 200 }
    );

    // Set cookie directly on NextResponse — this guarantees Set-Cookie header is sent
    response.cookies.set('dawat_admin_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  }



  async logout(req: NextRequest): Promise<NextResponse> {
    const payload = await getAdminPayload();
    await authService.logout(payload?.email);

    return ApiResponse.success(null, 'Logged out successfully');
  }


  async verify(): Promise<NextResponse> {
    const payload = await getAdminPayload();

    if (!payload) {
      return ApiResponse.error('Not authenticated', 'UNAUTHENTICATED', 401);
    }

    return ApiResponse.success({
      authenticated: true,
      admin: {
        id: payload.adminId,
        email: payload.email,
        role: payload.role,
      },
    });
  }
}

