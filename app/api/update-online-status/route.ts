// app/api/update-online-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { telegramId, isOnline } = await req.json();

        if (!telegramId) {
            return NextResponse.json({ error: 'Invalid telegramId' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { telegramId },
            data: { 
                isOnline,
                currentTime: new Date(),
            }
        });

        return NextResponse.json({ success: true, isOnline: updatedUser.isOnline });
    } catch (error) {
        console.error('Error updating online status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
