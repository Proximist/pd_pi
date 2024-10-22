// app/api/increase-points/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { telegramId, pointsToAdd, buttonId } = await req.json();

        if (!telegramId) {
            return NextResponse.json({ error: 'Invalid telegramId' }, { status: 400 });
        }

        let claimedField: string | null = null;
        if (buttonId === 'button1') {
            claimedField = 'claimedButton1';
        } else if (buttonId === 'button2') {
            claimedField = 'claimedButton2';
        } else if (buttonId === 'button3') {
            claimedField = 'claimedButton3';
        } else if (buttonId === 'button4') {
            claimedField = 'claimedButton4';
        } else if (buttonId === 'button5') {
            claimedField = 'claimedButton5';
        } else if (buttonId === 'button6') {
            claimedField = 'claimedButton6';
        } else if (buttonId === 'button7') {
            claimedField = 'claimedButton7';
        } else if (buttonId === 'button8') {
            claimedField = 'claimedButton8';
        }

        const updateData: any = { 
            points: { increment: pointsToAdd },
        };

        if (claimedField) {
            updateData[claimedField] = true;
        }

        if (buttonId === 'farmButton') {
            updateData.startFarming = null;
        }

        const updatedUser = await prisma.user.update({
            where: { telegramId },
            data: updateData
        });

        return NextResponse.json({ success: true, points: updatedUser.points });
    } catch (error) {
        console.error('Error increasing points:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
