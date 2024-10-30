// app/api/countdown/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const countdownConfig = await prisma.countdownConfig.findFirst();
    if (countdownConfig) {
      return NextResponse.json({ countdownEndDate: countdownConfig.endDate.toISOString() });
    } else {
      return NextResponse.json({});
    }
  } catch (error) {
    console.error('Error fetching countdown end date:', error);
    return NextResponse.json({ error: 'Failed to fetch countdown end date' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { countdownEndDate } = await request.json();
    await prisma.countdownConfig.upsert({
      where: { id: '1' },
      update: { endDate: new Date(countdownEndDate) },
      create: { id: '1', endDate: new Date(countdownEndDate) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving countdown end date:', error);
    return NextResponse.json({ error: 'Failed to save countdown end date' }, { status: 500 });
  }
}
