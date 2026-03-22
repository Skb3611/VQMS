import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      include: {
        queue: {
          include: {
            _count: {
              select: {
                tokens: {
                  where: {
                    status: "WAITING",
                  },
                },
              },
            },
          },
        },
      },
    })

    const formattedStores = stores.map((store) => ({
      id: store.id,
      name: store.name,
      description: store.desc,
      queueLength: store.queue?._count.tokens || 0,
    }))

    return NextResponse.json({ stores: formattedStores })
  } catch (err) {
    console.error(err)
    return new Response("Internal Server Error", { status: 500 })
  }
}
