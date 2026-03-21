'use client'

import { redirect } from 'next/navigation'

export default function UserDashboardPage() {
  redirect('/dashboard/user/status')
}
