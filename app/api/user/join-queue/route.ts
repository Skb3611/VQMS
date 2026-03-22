import prisma from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { storeId } = await req.json()

    if (!storeId || typeof storeId !== 'number') {
      return NextResponse.json(
        { message: "Valid Store ID is required" },
        { status: 400 }
      )
    }

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

    // Check if user is already in a WAITING or CALLED state in any queue
    const activeToken = await prisma.token.findFirst({
      where: {
        userId: dbUser.id,
        status: {
          in: ["WAITING", "CALLED"],
        },
      },
    })

    if (activeToken) {
      return NextResponse.json(
        { message: "You already have an active token." },
        { status: 400 }
      )
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: { queue: true },
    })

    if (!store || !store.queue) {
      return new Response("Store or queue not found", { status: 404 })
    }

    // Get the last token number for this queue
    const lastToken = await prisma.token.findFirst({
      where: { queueId: store.queue.id },
      orderBy: { tokenNumber: "desc" },
    })

    const nextTokenNumber = (lastToken?.tokenNumber || 0) + 1

    const newToken = await prisma.token.create({
      data: {
        tokenNumber: nextTokenNumber,
        status: "WAITING",
        queueId: store.queue.id,
        userId: dbUser.id,
      },
      include: {
        queue: {
          include: {
            store: true,
          },
        },
      },
    })

    // Calculate position
    const position = await prisma.token.count({
      where: {
        queueId: store.queue.id,
        status: "WAITING",
        tokenNumber: {
          lte: nextTokenNumber,
        },
      },
    })

    return NextResponse.json({
      message: "Successfully joined queue",
      token: newToken,
      position,
    })
  } catch (err) {
    console.error(err)
    return new Response("Internal Server Error", { status: 500 })
  }
}
