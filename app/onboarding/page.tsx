'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Users, Building2, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function OnboardingPage() {
  const [selected, setSelected] = useState<'user' | 'business' | null>(null)

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="text-lg font-bold text-primary">
            VirtualQueue
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          {/* Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Let's Get Started
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your account type to begin managing queues effectively
            </p>
          </div>

          {/* Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Individual User Card */}
            <button
              onClick={() => setSelected('user')}
              className="focus:outline-none transition-all duration-200"
            >
              <Card
                className={`p-8 cursor-pointer transition-all duration-200 ${
                  selected === 'user'
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-border hover:border-primary/50 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 transition-colors duration-200 ${
                      selected === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Users className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    I'm a Customer
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Join queues online, skip the line, and manage your wait time
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 mb-6 text-left w-full">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Join any queue from your phone</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Real-time wait time estimates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Get notifications when it's your turn</span>
                    </li>
                  </ul>
                  <div className="w-full">
                    <Button
                      className={`w-full transition-all duration-200 ${
                        selected === 'user'
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                          : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                      }`}
                    >
                      Continue as Customer <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            </button>

            {/* Business Card */}
            <button
              onClick={() => setSelected('business')}
              className="focus:outline-none transition-all duration-200"
            >
              <Card
                className={`p-8 cursor-pointer transition-all duration-200 ${
                  selected === 'business'
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-border hover:border-primary/50 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 transition-colors duration-200 ${
                      selected === 'business'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Building2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    I'm a Business
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Streamline operations and improve customer satisfaction
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 mb-6 text-left w-full">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Manage customer queues efficiently</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Analytics and insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Reduce wait times and improve service</span>
                    </li>
                  </ul>
                  <div className="w-full">
                    <Button
                      className={`w-full transition-all duration-200 ${
                        selected === 'business'
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                          : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                      }`}
                    >
                      Continue as Business <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            </button>
          </div>

          {/* Footer note */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
