"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import prisma from "./db"

export const updateOnboarding = async (status: "user" | "business") => {
  try {
    const client = await clerkClient()
    await prisma.user.update({
      where: {
        clerkId: (await auth()).userId as string,
      },
      data: {
        role: status === "user" ? "USER" : "BUSINESS",
      },
    })
    await client.users.updateUser((await auth()).userId as string, {
      publicMetadata: {
        onboarding: true,
        role: status === "user" ? "USER" : "BUSINESS",
      },
    })

    return
  } catch (err) {
    console.error("Error updating onboarding:", err)
  }
}
