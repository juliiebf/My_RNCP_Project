import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const userId = decoded.id

    const { tmdbId, mediaType } = await request.json()

    await prisma.view.create({
      data: {
        userId,
        tmdbId,
        mediaType,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const userId = decoded.id

    const views = await prisma.view.findMany({
      where: { userId },
      orderBy: { viewedAt: "desc" },
      take: 20,
    })

    return NextResponse.json(views)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
