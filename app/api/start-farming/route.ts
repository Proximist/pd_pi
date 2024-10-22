// app/api/start-farming/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { telegramId } = await req.json();

        if (!telegramId) {
            return NextResponse.json({ error: 'Invalid telegramId' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { telegramId },
            data: { 
                startFarming: new Date(),
                isOnline: true,
            }
        });

        return NextResponse.json({ success: true, startFarming: updatedUser.startFarming });
    } catch (error) {
        console.error('Error starting farming:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
