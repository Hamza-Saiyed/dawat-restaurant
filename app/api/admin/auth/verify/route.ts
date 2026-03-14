import { NextRequest, NextResponse } from 'next/server'
import { asyncHandler } from '@/backend/utils/asyncHandler'
import { verifyToken } from '@/lib/auth'

export const GET = asyncHandler(async (req: NextRequest) => {
  const token = req.cookies.get('dawat_admin_token')?.value

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }

  const payload = await verifyToken(token)

  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }

  return NextResponse.json({
    authenticated: true,
    admin: {
      id: payload.adminId,
      email: payload.email,
      role: payload.role,
    },
  }, { status: 200 })
})
