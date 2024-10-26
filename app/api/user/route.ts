import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();

    if (!userData || !userData.id) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { telegramId: userData.id },
      select: {
        telegramId: true,
        username: true,
        firstName: true,
        lastName: true,
        points: true,
        claimedButton1: true,
        claimedButton2: true,
        claimedButton3: true,
        claimedButton4: true,
        claimedButton5: true,
        claimedButton6: true,
        claimedButton7: true,
        claimedButton8: true,
        claimedButton9: true,
        claimedButton10: true,
        claimedButton11: true,
        invitedUsers: true,
        invitedBy: true,
        startFarming: true,
        isOnline: true,
        currentTime: true
      }
    });

    const inviterId = userData.start_param ? parseInt(userData.start_param) : null;

    if (!user) {
      if (inviterId) {
        const inviterInfo = await prisma.user.findUnique({
          where: { telegramId: inviterId },
          select: { username: true, firstName: true, lastName: true }
        });

        if (inviterInfo) {
          user = await prisma.user.create({
            data: {
              telegramId: userData.id,
              username: userData.username || '',
              firstName: userData.first_name || '',
              lastName: userData.last_name || '',
              invitedBy: `@${inviterInfo.username || inviterId}`,
              isOnline: true,
              currentTime: new Date()
            }
          });

          // Award 1000 points to the inviter
          await prisma.user.update({
            where: { telegramId: inviterId },
            data: {
              invitedUsers: {
                push: `@${userData.username || userData.id}`
              },
              points: {
                increment: 2500
              }
            }
          });
        } else {
          user = await prisma.user.create({
            data: {
              telegramId: userData.id,
              username: userData.username || '',
              firstName: userData.first_name || '',
              lastName: userData.last_name || '',
              isOnline: true,
              currentTime: new Date()
            }
          });
        }
      } else {
        user = await prisma.user.create({
          data: {
            telegramId: userData.id,
            username: userData.username || '',
            firstName: userData.first_name || '',
            lastName: userData.last_name || '',
            isOnline: true,
            currentTime: new Date()
          }
        });
      }
    } else {
      // Update user's online status and current time
      user = await prisma.user.update({
        where: { telegramId: userData.id },
        data: {
          isOnline: true,
          currentTime: new Date()
        }
      });
    }

    let inviterInfo = null;
    if (inviterId) {
      inviterInfo = await prisma.user.findUnique({
        where: { telegramId: inviterId },
        select: { username: true, firstName: true, lastName: true }
      });
    }

    // Check farming status
    let farmingStatus = 'farm';
    if (user.startFarming) {
      const now = new Date();
      const timeDiff = now.getTime() - user.startFarming.getTime();
      if (timeDiff < 30000) { // Less than 30 seconds
        farmingStatus = 'farming';
      } else {
        farmingStatus = 'claim';
      }
    }

    return NextResponse.json({ user, inviterInfo, farmingStatus });
  } catch (error) {
    console.error('Error processing user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
