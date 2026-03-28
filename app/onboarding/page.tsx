"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Users, Building2, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { updateOnboarding } from "@/lib/server-actions"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

export default function OnboardingPage() {
  const [selected, setSelected] = useState<"user" | "business" | null>(null)
  const router = useRouter()
  const { user } = useUser()
  useEffect(() => {
    if (user?.publicMetadata.onboarding) {
      router.push("/dashboard")
    }
  }, [user])
  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* Header */}

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          {/* Heading */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-balance text-foreground md:text-5xl">
              Let's Get Started
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Choose your account type to begin managing queues effectively
            </p>
          </div>

          {/* Selection Cards */}
          <div className="mb-8 grid gap-8 md:grid-cols-2">
            {/* Individual User Card */}
            <div
              onClick={async () => {
                await updateOnboarding("user")
                router.push("/dashboard/user")
              }}
              className="transition-all duration-200 focus:outline-none"
            >
              <Card
                className={`cursor-pointer p-8 transition-all duration-200 ${
                  selected === "user"
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border hover:border-primary/50 hover:shadow-md"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-lg transition-colors duration-200 ${
                      selected === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Users className="h-8 w-8" />
                  </div>
                  <h2 className="mb-2 text-2xl font-bold text-foreground">
                    I'm a Customer
                  </h2>
                  <p className="mb-6 text-muted-foreground">
                    Join queues online, skip the line, and manage your wait time
                  </p>
                  <ul className="mb-6 w-full space-y-2 text-left text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-primary">✓</span>
                      <span>Join any queue from your phone</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-primary">✓</span>
                      <span>Real-time wait time estimates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-primary">✓</span>
                      <span>Get notifications when it's your turn</span>
                    </li>
                  </ul>
                  <div className="w-full">
                    <Button
                      className={`w-full transition-all duration-200 ${
                        selected === "user"
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      Continue as Customer{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Business Card */}
            <div
              onClick={async () => {
                await updateOnboarding("business")
                router.push("/dashboard/business")
              }}
              className="transition-all duration-200 focus:outline-none"
            >
              <Card
                className={`cursor-pointer p-8 transition-all duration-200 ${
                  selected === "business"
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border hover:border-primary/50 hover:shadow-md"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-lg transition-colors duration-200 ${
                      selected === "business"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Building2 className="h-8 w-8" />
                  </div>
                  <h2 className="mb-2 text-2xl font-bold text-foreground">
                    I'm a Business
                  </h2>
                  <p className="mb-6 text-muted-foreground">
                    Streamline operations and improve customer satisfaction
                  </p>
                  <ul className="mb-6 w-full space-y-2 text-left text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-primary">✓</span>
                      <span>Manage customer queues efficiently</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-primary">✓</span>
                      <span>Analytics and insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-primary">✓</span>
                      <span>Reduce wait times and improve service</span>
                    </li>
                  </ul>
                  <div className="w-full">
                    <Button
                      className={`w-full transition-all duration-200 ${
                        selected === "business"
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      Continue as Business{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
