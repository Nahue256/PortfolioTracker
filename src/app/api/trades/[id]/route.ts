import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trade = await prisma.trade.findUnique({
      where: { id: params.id },
    });
    
    if (!trade) {
      return NextResponse.json(
        { error: "Trade not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(trade);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch trade" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { ticker, entryPrice, exitPrice, quantity, date } = await request.json();
    
    const trade = await prisma.trade.update({
      where: { id: params.id },
      data: {
        ticker,
        entryPrice,
        exitPrice,
        quantity,
        date: new Date(date),
      },
    });
    
    return NextResponse.json(trade);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update trade" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.trade.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete trade:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}