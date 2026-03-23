"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import {
  Clock,
  Users,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  ListCheck,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Home() {
  const { user, isSignedIn } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            QueueFlow
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm transition hover:text-primary"
            >
              How it Works
            </a>
            <a
              href="#features"
              className="text-sm transition hover:text-primary"
            >
              Features
            </a>
            <a
              href="#use-cases"
              className="text-sm transition hover:text-primary"
            >
              Use Cases
            </a>
            {!isSignedIn ? (
              <SignInButton>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started
                </Button>
              </SignInButton>
            ) : (
              <UserButton />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="space-y-3 border-t border-border px-4 py-4 md:hidden">
            <a
              href="#how-it-works"
              className="block py-2 text-sm hover:text-primary"
            >
              How it Works
            </a>
            <a
              href="#features"
              className="block py-2 text-sm hover:text-primary"
            >
              Features
            </a>
            <a
              href="#use-cases"
              className="block py-2 text-sm hover:text-primary"
            >
              Use Cases
            </a>
            {!isSignedIn ? (
              <SignInButton>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started
                </Button>
              </SignInButton>
            ) : (
              <UserButton />
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="">
          <div className="flex flex-col items-center justify-center space-y-6">
            <h1 className="text-center text-5xl leading-tight font-bold text-balance lg:text-6xl">
              Skip the Line. Join Queues Online.
            </h1>
            <p className="mx-auto max-w-[80%] text-center text-lg leading-relaxed text-muted-foreground">
              Save time by joining queues digitally. Customers get instant
              notifications when it's their turn, and businesses can manage
              crowds effortlessly.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-primary px-8 py-6 text-base text-primary-foreground hover:bg-primary/90"
              >
                Join Queue
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="px-8 py-6 text-base"
              >
                Create Store
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-secondary/30 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-4xl font-bold text-balance lg:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Three simple steps to skip physical waiting and manage queues
              smartly.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Join Queue",
                description:
                  "Scan a code or enter the store ID to join the queue online from anywhere.",
                icon: Users,
              },
              {
                step: "2",
                title: "Get Token",
                description:
                  "Receive a digital token with your position and estimated wait time.",
                icon: Zap,
              },
              {
                step: "3",
                title: "Get Called",
                description:
                  "Receive a notification when it's your turn to be served.",
                icon: CheckCircle2,
              },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <Card
                  key={idx}
                  className="border border-border bg-background transition hover:shadow-lg"
                >
                  <CardContent className="space-y-4 p-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                        <Icon className="text-primary" size={24} />
                      </div>
                      <span className="text-sm font-bold text-primary/60">
                        Step {item.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32"
      >
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-4xl font-bold text-balance lg:text-5xl">
            Powerful Features
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Everything you need to manage queues effectively and improve
            customer satisfaction.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {[
            {
              title: "Real-time Queue Tracking",
              description:
                "Monitor queue status in real-time with live updates and analytics.",
              icon: BarChart3,
            },
            {
              title: "Digital Token System",
              description:
                "Issue digital tokens with position numbers and estimated wait times.",
              icon: Zap,
            },
            {
              title: "Business Dashboard",
              description:
                "Comprehensive dashboard to manage queues, staff, and customer flow.",
              icon: Clock,
            },
            {
              title: "Time-Saving Experience",
              description:
                "Customers avoid physical waiting and plan their time better.",
              icon: CheckCircle2,
            },
          ].map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card key={idx} className="border border-border bg-background">
                <CardContent className="space-y-4 p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="bg-secondary/30 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-4xl font-bold text-balance lg:text-5xl">
              Perfect For
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Virtual Queue System works for any business that manages customer
              queues.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              { name: "Retail Stores", emoji: "🛍️" },
              { name: "Hospitals", emoji: "🏥" },
              { name: "Banks", emoji: "🏦" },
              { name: "Salons", emoji: "✨" },
            ].map((useCase, idx) => (
              <Card
                key={idx}
                className="border border-border bg-background text-center transition hover:shadow-md"
              >
                <CardContent className="space-y-4 p-8">
                  <div className="text-5xl">{useCase.emoji}</div>
                  <h3 className="text-lg font-semibold">{useCase.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-balance lg:text-5xl">
              Benefits For Everyone
            </h2>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-primary">
                  For Customers
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-3">
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 flex-shrink-0 text-primary"
                    />
                    <span>Save time by avoiding physical queues</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 flex-shrink-0 text-primary"
                    />
                    <span>Know exact wait times</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 flex-shrink-0 text-primary"
                    />
                    <span>Get instant notifications</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-primary">
                  For Businesses
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-3">
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 flex-shrink-0 text-primary"
                    />
                    <span>Manage customer flow easily</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 flex-shrink-0 text-primary"
                    />
                    <span>Improve operational efficiency</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 flex-shrink-0 text-primary"
                    />
                    <span>Better customer satisfaction</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex h-96 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 lg:p-12">
            <div className="text-center">
              <Users size={80} className="mx-auto mb-4 text-primary/60" />
              <p className="font-medium text-muted-foreground">
                Customer & Business Benefits
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-primary-foreground lg:py-32">
        <div className="mx-auto max-w-4xl space-y-8 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-balance lg:text-6xl">
            Start Managing Queues Smarter
          </h2>
          <p className="mx-auto max-w-2xl text-lg opacity-90">
            Join thousands of businesses that are improving their customer
            experience with Virtual Queue System.
          </p>
          <Button className="rounded-full bg-primary-foreground px-8 py-6 text-base text-primary hover:bg-primary-foreground/90">
            Get Started Today
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-bold text-primary">QueueFlow</h3>
              <p className="text-sm text-muted-foreground">
                Transforming the way businesses and customers interact through
                digital queues.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition hover:text-primary">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-primary">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-primary">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition hover:text-primary">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-primary">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-primary">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition hover:text-primary">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-primary">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 QueueFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
