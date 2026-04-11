import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const place = searchParams.get('place')

    const stores = await prisma.store.findMany({
      where: place ? {
        place: {
          contains: place,
          mode: 'insensitive'
        }
      } : {},
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
      place: store.place,
      queueLength: store.queue?._count.tokens || 0,
    }))

    return NextResponse.json({ stores: formattedStores })
  } catch (err) {
    console.error(err)
    return new Response("Internal Server Error", { status: 500 })
  }
}
