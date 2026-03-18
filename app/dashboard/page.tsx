"use client"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

const page = () => {
  const { user } = useUser()
  const router = useRouter()
  useEffect(() => {
    if (!user) return
    if (!user?.publicMetadata.onboarding) {
      router.push("/onboarding")
    }
  }, [user])

  return <div>HI THERE</div>
}

export default page
