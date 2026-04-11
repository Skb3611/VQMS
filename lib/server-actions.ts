"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import prisma from "./db"

export const updateOnboarding = async (status: "user" | "business") => {
  try {
    const client = await clerkClient()
    const { userId } = await auth()
    
    if (!userId) return

    const clerkUser = await client.users.getUser(userId)
    const email = clerkUser.emailAddresses[0].emailAddress
    const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim()

    // Use upsert to ensure the user record exists in the database
    // This handles cases where the user might have been deleted but still exists in Clerk
    await prisma.user.upsert({
      where: {
        clerkId: userId,
      },
      update: {
        role: status === "user" ? "USER" : "BUSINESS",
      },
      create: {
        clerkId: userId,
        email: email,
        name: name,
        role: status === "user" ? "USER" : "BUSINESS",
      },
    })
    
    await client.users.updateUser(userId, {
      publicMetadata: {
        onboarding: true,
        role: status === "user" ? "USER" : "BUSINESS",
      },
    })

    return
  } catch (err) {
    console.log("API Error:", err)
  }
}
