'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

interface DashboardHeaderProps {
  title: string
  userRole?: 'user' | 'business'
}

export function DashboardHeader({ title, userRole = 'user' }: DashboardHeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="flex items-center justify-between h-16 px-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userRole === 'user' ? 'US' : 'BS'}
            </AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
