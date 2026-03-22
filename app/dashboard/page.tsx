"use client"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

const page = () => {
  const { user } = useUser()
  const router = useRouter()
  useEffect(() => {
    console.log(user?.publicMetadata)
    if (!user) return
    if (!user?.publicMetadata.onboarding) {
      router.push("/onboarding")
    } else if (
      user?.publicMetadata.onboarding &&
      user?.publicMetadata.role === "USER"
    ) {
      router.push("/dashboard/user")
    } else if (
      user?.publicMetadata.onboarding &&
      user?.publicMetadata.role === "BUSINESS"
    ) {
      router.push("/dashboard/business")
    }
  }, [user])

  return <></>
}

export default page
