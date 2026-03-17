import prisma from "@/lib/db"
import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    if (evt.type === "user.created") {
      console.log("userId:", evt.data.id)
      console.log("userId:", evt.data.first_name)
      console.log("userId:", evt.data.last_name)
      console.log("userId:", evt.data.email_addresses[0].email_address)
      const name = `${evt.data.first_name} ${evt.data.last_name}`
      await prisma.user.create({
        data: {
          clerkId: evt.data.id,
          email: evt.data.email_addresses[0].email_address,
          name,
        },
      })
    }

    return new Response("Webhook received", { status: 200 })
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error verifying webhook", { status: 400 })
  }
}
