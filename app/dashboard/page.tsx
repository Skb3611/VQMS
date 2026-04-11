"use client"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

const page = () => {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  useEffect(() => {
    if (!isLoaded || !user) return
    
    console.log("Dashboard redirect check:", user.publicMetadata)
    
    if (!user.publicMetadata.onboarding) {
      router.push("/onboarding")
    } else if (
      user.publicMetadata.role === "USER"
    ) {
      router.push("/dashboard/user")
    } else if (
      user.publicMetadata.role === "BUSINESS"
    ) {
      router.push("/dashboard/business")
    }
  }, [user, isLoaded])

  return <></>
}

export default page
