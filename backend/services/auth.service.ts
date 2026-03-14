// Auth service — authentication business logic

import connectDB from '@/lib/mongodb';
import Admin, { IAdmin } from '@/models/Admin';
import { generateToken, setAuthCookie, clearAuthCookie } from '@/lib/auth';
import { AppError } from '@/backend/utils/asyncHandler';
import { ActivityLogService } from './activityLog.service';
import { logger } from '@/lib/logger';

export class AuthService {
  async login(email: string, password: string, ip: string): Promise<{
    admin: { id: string; name: string; email: string; role: string };
    token: string;
  }> {

    await connectDB();

    // Find admin
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      logger.warn('Login attempt with non-existent email', { email, ip });
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Check if active
    if (!admin.isActive) {
      throw new AppError('This account has been deactivated', 403, 'ACCOUNT_DISABLED');
    }

    // Check if locked
    if (admin.isLocked) {
      throw new AppError(
        'Account temporarily locked due to multiple failed login attempts',
        403,
        'ACCOUNT_LOCKED'
      );
    }

    // Compare password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      // Increment login attempts
      admin.loginAttempts += 1;
      if (admin.loginAttempts >= 5) {
        admin.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock 30 min
      }
      await admin.save();

      logger.warn('Failed login attempt', { email, ip, attempts: admin.loginAttempts });
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Success — reset attempts, update last login
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token and set cookie
    const token = await generateToken({
      adminId: (admin._id as unknown as { toString(): string }).toString(),
      email: admin.email,
      role: admin.role,
    });

    // We no longer set the cookie here. The controller will handle it.
    // await setAuthCookie(token);

    // Log activity (non-blocking)

    ActivityLogService.log({
      adminEmail: admin.email,
      action: 'ADMIN_LOGIN',
      ipAddress: ip,
    }).catch(() => {});

    logger.info('Admin login successful', { email: admin.email, ip });

    return {
      admin: {
        id: (admin._id as unknown as { toString(): string }).toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      token,
    };
  }


  async logout(adminEmail?: string): Promise<void> {
    await clearAuthCookie();

    if (adminEmail) {
      ActivityLogService.log({
        adminEmail,
        action: 'ADMIN_LOGOUT',
      }).catch(() => {});
    }
  }
}
