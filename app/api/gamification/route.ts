import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/utils";
import { ensureQuests, evaluateBadges, syncWeeklyStreakQuest, todayKey, weekKey, xpForNextLevel } from "@/lib/gamification";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json(errorResponse([], "Unauthorized", 1), { status: 401 });
    const userId = session.user.id;
    await ensureQuests(userId);
    await syncWeeklyStreakQuest(userId);
    await evaluateBadges(userId);

    const [user, badges, dailyQuests, weeklyQuests] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { xp: true, level: true, streakCount: true, longestStreak: true, lastActiveDate: true } }),
      prisma.userBadge.findMany({ where: { userId }, orderBy: { earnedAt: "desc" } }),
      prisma.userQuest.findMany({ where: { userId, type: "DAILY", periodKey: todayKey() }, orderBy: { createdAt: "asc" } }),
      prisma.userQuest.findMany({ where: { userId, type: "WEEKLY", periodKey: weekKey() }, orderBy: { createdAt: "asc" } }),
    ]);

    const xp = user?.xp || 0;
    const level = user?.level || 1;
    const next = xpForNextLevel(level);
    const prev = xpForNextLevel(level - 1);
    const progress = next > prev ? Math.min(100, Math.round(((xp - prev) / (next - prev)) * 100)) : 100;

    return NextResponse.json(successResponse({
      xp, level, nextLevelXp: next, levelProgress: progress,
      streakCount: user?.streakCount || 0, longestStreak: user?.longestStreak || 0,
      badges, dailyQuests, weeklyQuests,
    }, "Gamification summary"));
  } catch (error) {
    console.error("gamification error", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), { status: 500 });
  }
}
