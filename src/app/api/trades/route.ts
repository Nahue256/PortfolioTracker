import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const portfolioId = url.searchParams.get("portfolioId");
    
    if (!portfolioId) {
      return NextResponse.json(
        { error: "Portfolio ID is required" },
        { status: 400 }
      );
    }
    
    const trades = await prisma.trade.findMany({
      where: {
        portfolioId,
      },
      orderBy: {
        date: 'asc',
      },
    });
    
    return NextResponse.json(trades);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch trades" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ticker, entryPrice, exitPrice, quantity, date, portfolioId } = await request.json();
    
    if (!ticker || !portfolioId) {
      return NextResponse.json(
        { error: "Ticker and portfolioId are required" },
        { status: 400 }
      );
    }
    
    const trade = await prisma.trade.create({
      data: {
        ticker,
        entryPrice,
        exitPrice,
        quantity,
        date: new Date(date),
        portfolioId,
      },
    });
    
    return NextResponse.json(trade, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create trade" },
      { status: 500 }
    );
  }
}