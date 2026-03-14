import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export default function AdminIndex() {
  redirect('/admin/dashboard');
}
