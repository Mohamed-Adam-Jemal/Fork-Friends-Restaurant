// app/api/menu/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET a specific item
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: Number(params.id) },
    })
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Error fetching item' }, { status: 500 })
  }
}

// PUT: Update an item
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const updatedItem = await prisma.menuItem.update({
      where: { id: Number(params.id) },
      data: body,
    })
    return NextResponse.json(updatedItem)
  } catch {
    return NextResponse.json({ error: 'Error updating item' }, { status: 500 })
  }
}

// DELETE: Delete an item
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.menuItem.delete({
      where: { id: Number(params.id) },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error deleting item' }, { status: 500 })
  }
}
