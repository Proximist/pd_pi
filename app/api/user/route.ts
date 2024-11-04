import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const LEVELS = [
    { name: 'Rookie', threshold: 100, pointsPerHundredXP: 1 },
    { name: 'Bronze', threshold: 101, pointsPerHundredXP: 3 },
    { name: 'Silver', threshold: 300, pointsPerHundredXP: 5 },
    { name: 'Gold', threshold: 700, pointsPerHundredXP: 7 },
    { name: 'Diamond', threshold: 1100, pointsPerHundredXP: 10 },
    { name: 'Platinum', threshold: 1500, pointsPerHundredXP: 15 },
    { name: 'Infinite', threshold: Infinity, pointsPerHundredXP: 15 }
];

function calculateTotalPiSold(statuses: string[], amounts: number[]): number {
    return statuses.reduce((total, status, index) => {
        if (status === 'completed') {
            return total + (amounts[index] || 0);
        }
        return total;
    }, 0);
}

function calculateTotalCommission(invitedUsersData: any[]): number {
    return invitedUsersData.reduce((total, user) => {
        return total + (user.totalPisold * 0.1);
    }, 0);
}

function calculateProfileMetrics(piAmountArray: number[], transactionStatus: string[]) {
    const totalPiSold = calculateTotalPiSold(transactionStatus, piAmountArray);
    const xp = totalPiSold;
    const currentLevel = LEVELS.findIndex(lvl => xp < lvl.threshold);
    const level = currentLevel === -1 ? LEVELS.length : currentLevel;
    const pointsRate = LEVELS[level - 1]?.pointsPerHundredXP || LEVELS[LEVELS.length - 1].pointsPerHundredXP;
    const piPoints = Math.floor(xp / 100) * pointsRate;

    return {
        totalPiSold,
        xp,
        level,
        piPoints
    };
}

function canInitiateNewTransaction(transactionStatus: string[]) {
    if (transactionStatus.length === 0) return true;
    const lastStatus = transactionStatus[transactionStatus.length - 1];
    return lastStatus === 'completed' || lastStatus === 'failed';
}

function calculateTwoStepCommission(invitedUsersData: any[]) {
  return invitedUsersData.reduce((total, user) => {
    if (user.invitedUsers) {
      return total + (user.invitedUsers.reduce((subTotal, invitedUser) => {
        const invitedUserData = invitedUsersData.find(u => u.username === invitedUser);
        return subTotal + (invitedUserData?.totalPisold || 0) * 0.025;
      }, 0));
    }
    return total;
  }, 0);
}

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
        invitedUsers: true,
        invitedBy: true,
        startFarming: true,
        isOnline: true,
        currentTime: true,
        level: true,
        piAmount: true,
        transactionStatus: true,
        introSeen: true,
        paymentMethod: true,
        paymentAddress: true,
        isUpload: true,
        imageUrl: true,
        savedImages: true,
        finalpis: true,
        baseprice: true,
        piaddress: true,
        istransaction: true,
        totalPisold: true,
        totalCommission: true,
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
              currentTime: new Date(),
              level: 1,
              transactionStatus: [],
              totalPisold: 0,
              totalCommission: 0
            }
          });

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
              currentTime: new Date(),
              level: 1,
              transactionStatus: [],
              totalPisold: 0,
              totalCommission: 0
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
            currentTime: new Date(),
            level: 1,
            transactionStatus: [],
            totalPisold: 0,
            totalCommission: 0
          }
        });
      }
    }

    // Fetch totalPisold data for all invited users
    const invitedUsersData = await Promise.all(
      user.invitedUsers.map(async (invitedUsername: string) => {
        const username = invitedUsername.startsWith('@') ? invitedUsername.substring(1) : invitedUsername;
        
        const invitedUser = await prisma.user.findFirst({
          where: { username },
          select: { username: true, totalPisold: true }
        });

        return {
          username: invitedUsername,
          totalPisold: invitedUser?.totalPisold || 0
        };
      })
    );

    // Calculate total commission
    const totalCommission = calculateTotalCommission(invitedUsersData);

    // Update user's online status, current time, and total commission
    user = await prisma.user.update({
      where: { telegramId: userData.id },
      data: {
        isOnline: true,
        currentTime: new Date(),
        totalPisold: calculateTotalPiSold(user.transactionStatus, user.piAmount),
        totalCommission: totalCommission,
        twostepcom: calculateTwoStepCommission(invitedUsersData)
      }
    });

    let inviterInfo = null;
    if (inviterId) {
      inviterInfo = await prisma.user.findUnique({
        where: { telegramId: inviterId },
        select: { username: true, firstName: true, lastName: true }
      });
    }

    // Handle new transaction initiation
    if (userData.newTransaction) {
      if (!canInitiateNewTransaction(user.transactionStatus)) {
          return NextResponse.json({ 
              error: 'Cannot start new transaction while previous transaction is processing'
          }, { status: 400 })
      }

      user = await prisma.user.update({
          where: { telegramId: userData.id },
          data: { 
              transactionStatus: {
                  push: 'processing'
              }
          },
      })
    }

    // Handle transaction status update if provided
    if (userData.updateTransactionStatus) {
      const { index, status } = userData.updateTransactionStatus
      if (index >= 0 && ['processing', 'completed', 'failed'].includes(status)) {
          const newStatuses = [...user.transactionStatus]
          newStatuses[index] = status
          
          const updatedUser = await prisma.user.update({
              where: { telegramId: userData.id },
              data: { 
                  transactionStatus: newStatuses,
                  totalPisold: calculateTotalPiSold(newStatuses, user.piAmount)
              },
          })
          user = updatedUser;
      }
    }

    // Handle level update if requested
    if (userData.updateLevel) {
      user = await prisma.user.update({
          where: { telegramId: userData.id },
          data: { 
              level: userData.level
          },
      })
    }

    // Check farming status
    let farmingStatus = 'farm';
    if (user.startFarming) {
      const now = new Date();
      const timeDiff = now.getTime() - user.startFarming.getTime();
      if (timeDiff < 30000) {
        farmingStatus = 'farming';
      } else {
        farmingStatus = 'claim';
      }
    }

    // Calculate profile metrics
    const metrics = calculateProfileMetrics(user.piAmount, user.transactionStatus);

    return NextResponse.json({
      ...user,
      user,
      invitedUsersData,
      ...metrics,
      status: user.transactionStatus,
      inviterInfo,
      farmingStatus
    });
  } catch (error) {
    console.error('Error processing user data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
