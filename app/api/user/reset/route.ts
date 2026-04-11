import prisma from "@/lib/db"
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const user = await currentUser()
    const client = await clerkClient()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const dbUser = await prisma.user.findFirst({
      where: { clerkId: user.id },
      include: {
        store: {
          include: {
            queue: true,
          },
        },
        tokens: true,
      },
    })

    if (!dbUser) {
      return new Response("User not found", { status: 404 })
    }

    await prisma.$transaction(async (tx) => {
      // 1. Delete tokens associated with the user (if user is a customer)
      await tx.token.deleteMany({
        where: { userId: dbUser.id },
      })

      // 2. If user is a business, delete their store, queue, and tokens for that queue
      if (dbUser.store) {
        const storeId = dbUser.store.id
        const queueId = dbUser.store.queue?.id

        if (queueId) {
          // Delete tokens for the store's queue
          await tx.token.deleteMany({
            where: { queueId: queueId },
          })
          // Delete the queue
          await tx.queue.delete({
            where: { id: queueId },
          })
        }

        // Delete the store
        await tx.store.delete({
          where: { id: storeId },
        })
      }

      // 3. Finally, delete the user themselves
      await tx.user.delete({
        where: { id: dbUser.id },
      })
    })

    // Update Clerk metadata AFTER database transaction succeeds
    await client.users.updateUser(user.id, {
      publicMetadata: {
        onboarding: false,
        role: null, // Reset role too so they can choose again
      },
    })

    return NextResponse.json({
      message: "Account reset successfully",
    })
  } catch (err) {
    console.error("Account Reset Error:", err)
    return new Response("Internal Server Error", { status: 500 })
  }
}
