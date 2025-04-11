import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(portfolios);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch portfolios" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, initialValue } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: "Portfolio name is required" },
        { status: 400 }
      );
    }
    
    const portfolio = await prisma.portfolio.create({
      data: {
        name,
        initialValue: initialValue || 0,
      },
    });
    
    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create portfolio" },
      { status: 500 }
    );
  }
}