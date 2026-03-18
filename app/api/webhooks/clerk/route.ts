import prisma from "@/lib/db"
import { clerkClient } from "@clerk/nextjs/server"
import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { NextRequest } from "next/server"
import { use } from "react"

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)
    const client = await clerkClient()
    if (evt.type === "user.created") {
      console.log("userId:", evt.data.id)
      console.log("userId:", evt.data.first_name)
      console.log("userId:", evt.data.last_name)
      console.log("userId:", evt.data.email_addresses[0].email_address)
      const name =
        `${evt.data.first_name || ""} ${evt.data.last_name || ""}`.trim()
      await prisma.user.create({
        data: {
          clerkId: evt.data.id,
          email: evt.data.email_addresses[0].email_address,
          name,
        },
      })
      await client.users.updateUser(evt.data.id, {
        publicMetadata: {
          onboarding: false,
          role: "",
        },
      })
    }

    return new Response("Webhook received", { status: 200 })
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error verifying webhook", { status: 400 })
  }
}
