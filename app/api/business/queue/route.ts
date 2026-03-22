import prisma from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const user = await currentUser()
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user?.id },
      include: {
        store: {
          include: {
            queue: {
              include: {
                tokens: {
                  where: {
                    OR: [{ status: "WAITING" }, { status: "CALLED" }],
                  },
                  orderBy: {
                    tokenNumber: "asc",
                  },
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!dbUser || !dbUser.store) {
      return new Response("Store not found", { status: 404 })
    }

    const tokens = dbUser.store.queue?.tokens || []
    const currentlyServing = tokens.find((t) => t.status === "CALLED")
    const waitingTokens = tokens.filter((t) => t.status === "WAITING")

    // Get statistics
    const completedTodayCount = await prisma.token.count({
      where: {
        queueId: dbUser.store.queue?.id,
        status: "COMPLETED",
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    })

    return NextResponse.json({
      currentlyServing,
      waitingTokens,
      allActiveTokens: tokens,
      stats: {
        completedToday: completedTodayCount,
        waitingCount: waitingTokens.length,
      },
    })
  } catch (err) {
    console.error(err)
    return new Response("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { action, tokenId } = await req.json()

    if (!action || !["CALL_NEXT", "COMPLETE", "SKIP"].includes(action)) {
      return NextResponse.json(
        { message: "Invalid or missing action" },
        { status: 400 }
      )
    }

    if (["COMPLETE", "SKIP"].includes(action) && (!tokenId || typeof tokenId !== 'number')) {
      return NextResponse.json(
        { message: "Valid Token ID is required for this action" },
        { status: 400 }
      )
    }

    const user = await currentUser()
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user?.id },
      include: { store: { include: { queue: true } } },
    })

    if (!dbUser || !dbUser.store || !dbUser.store.queue) {
      return new Response("Unauthorized or Store not found", { status: 401 })
    }

    const queueId = dbUser.store.queue.id

    if (action === "CALL_NEXT") {
      // 1. Complete any currently CALLED token
      await prisma.token.updateMany({
        where: {
          queueId,
          status: "CALLED",
        },
        data: {
          status: "COMPLETED",
        },
      })

      // 2. Call the next WAITING token
      const nextToken = await prisma.token.findFirst({
        where: {
          queueId,
          status: "WAITING",
        },
        orderBy: {
          tokenNumber: "asc",
        },
      })

      if (nextToken) {
        const updatedToken = await prisma.token.update({
          where: { id: nextToken.id },
          data: { status: "CALLED" },
        })
        return NextResponse.json({ message: "Called next token", token: updatedToken })
      }

      return NextResponse.json({ message: "No more tokens in queue" })
    }

    if (action === "COMPLETE") {
      if (!tokenId) return new Response("Token ID required", { status: 400 })
      
      const updatedToken = await prisma.token.update({
        where: { id: tokenId, queueId },
        data: { status: "COMPLETED" },
      })
      
      return NextResponse.json({ message: "Token completed", token: updatedToken })
    }

    if (action === "SKIP") {
      if (!tokenId) return new Response("Token ID required", { status: 400 })

      // For skipping, we can just mark it as COMPLETED for now, or maybe a separate status
      const updatedToken = await prisma.token.update({
        where: { id: tokenId, queueId },
        data: { status: "COMPLETED" },
      })

      return NextResponse.json({ message: "Token skipped", token: updatedToken })
    }

    return new Response("Invalid action", { status: 400 })
  } catch (err) {
    console.error(err)
    return new Response("Internal Server Error", { status: 500 })
  }
}
