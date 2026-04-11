import prisma from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    })

    if (!dbUser) {
      return new Response("User not found", { status: 404 })
    }

    // Get active token (WAITING or CALLED)
    const activeToken = await prisma.token.findFirst({
      where: {
        userId: dbUser.id,
        OR: [{ status: "WAITING" }, { status: "CALLED" }],
      },
      include: {
        queue: {
          include: {
            store: true,
          },
        },
      },
    })

    let position = 0
    if (activeToken && activeToken.status === "WAITING") {
      position = await prisma.token.count({
        where: {
          queueId: activeToken.queueId,
          status: "WAITING",
          tokenNumber: {
            lte: activeToken.tokenNumber,
          },
        },
      })
    }

    // Get historical tokens
    const historicalTokens = await prisma.token.findMany({
      where: {
        userId: dbUser.id,
        status: "COMPLETED",
      },
      include: {
        queue: {
          include: {
            store: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      activeToken: activeToken ? {
        ...activeToken,
        position,
      } : null,
      historicalTokens,
    })
  } catch (err) {
    console.log("API Error:", err)
    return new Response("Internal Server Error", { status: 500 })
  }
}
