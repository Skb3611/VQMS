import prisma from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, desc, openTime, closeTime, workingDays, address, place, category, maxQueueSize } = await req.json()

    if (!name || name.trim().length < 3) {
      return NextResponse.json(
        { message: "Store name must be at least 3 characters" },
        { status: 400 }
      )
    }

    if (desc && desc.length > 500) {
      return NextResponse.json(
        { message: "Description cannot exceed 500 characters" },
        { status: 400 }
      )
    }

    const user = await currentUser()
    const dbUser = await prisma.user.findFirst({
      where: { clerkId: user?.id },
      include: { store: true },
    })
    if (!dbUser) {
      return new Response("Unauthorized", { status: 401 })
    }
    if (dbUser.store) {
      return NextResponse.json(
        { message: "Business already has a store" },
        { status: 400 }
      )
    }
    const store = await prisma.store.create({
      data: {
        name,
        desc,
        openTime,
        closeTime,
        workingDays: workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        address,
        place,
        category,
        maxQueueSize: maxQueueSize || 50,
        user: {
          connect: { id: dbUser?.id },
        },
      },
      include: {
        queue: true,
      },
    })
    if (store) {
      await prisma.queue.create({
        data: {
          storeId: store?.id,
        },
      })
    }
    return NextResponse.json({
      message: "Store created",
      store: store,
    })
  } catch (err) {
    console.log("API Error:", err)
    return new Response("Internal Server Error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { name, desc, openTime, closeTime, workingDays, address, place, category, maxQueueSize } = await req.json()
    const user = await currentUser()
    const dbUser = await prisma.user.findFirst({
      where: { clerkId: user?.id },
      include: { store: true },
    })

    if (!dbUser || !dbUser.store) {
      return new Response("Store not found", { status: 404 })
    }

    const updatedStore = await prisma.store.update({
      where: { id: dbUser.store.id },
      data: {
        name,
        desc,
        openTime,
        closeTime,
        workingDays,
        address,
        place,
        category,
        maxQueueSize,
      },
    })

    return NextResponse.json({
      message: "Store updated",
      store: updatedStore,
    })
  } catch (err) {
    console.log("API Error:", err)
    return new Response("Internal Server Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const user = await currentUser()
    const dbUser = await prisma.user.findFirst({ where: { clerkId: user?.id } })
    if (!dbUser) {
      return new Response("Unauthorized", { status: 401 })
    }
    const store = await prisma.store.findUnique({
      where: { userId: dbUser?.id },
      include: {
        queue: true,
      },
    })
    return NextResponse.json({
      message: "Store fetched",
      store,
    })
  } catch (err) {
    console.log("API Error:", err)
    return new Response("Internal Server Error", { status: 500 })
  }
}

export async function DELETE() {
  try {
    const user = await currentUser()
    const dbUser = await prisma.user.findFirst({
      where: { clerkId: user?.id },
      include: { store: { include: { queue: true } } },
    })

    if (!dbUser || !dbUser.store) {
      return new Response("Store not found", { status: 404 })
    }

    // Prisma will handle cascading deletes if configured, 
    // but let's be explicit if needed or rely on the schema.
    // In our schema, we should check if we need to delete tokens first.
    
    const storeId = dbUser.store.id
    const queueId = dbUser.store.queue?.id

    await prisma.$transaction(async (tx) => {
      if (queueId) {
        // Delete tokens associated with the queue
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
    })

    return NextResponse.json({
      message: "Store deleted successfully",
    })
  } catch (err) {
    console.log("API Error:", err)
    return new Response("Internal Server Error", { status: 500 })
  }
}
