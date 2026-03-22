import prisma from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, desc } = await req.json()

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
    console.log(err)
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
    console.log(err)
  }
}
