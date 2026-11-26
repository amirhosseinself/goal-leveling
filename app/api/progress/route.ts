// /api/progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { successResponse, errorResponse } from "@/utils";

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), { status: 401 });
    }

    const userId = session.user.id;
    const url = new URL(req.url);
    const days = Math.min(90, Math.max(7, Number(url.searchParams.get("days") || 30)));
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - (days - 1));

    const [goalProgressSum, skillProgressSum, goalProgressCount, skillProgressCount, recentGoalProgress, recentSkillProgress, goalProgressRange, skillProgressRange] = await Promise.all([
      prisma.goalProgress.aggregate({ _sum: { rating: true }, where: { userId } }),
      prisma.skillProgress.aggregate({ _sum: { rating: true }, where: { userId } }),
      prisma.goalProgress.count({ where: { userId } }),
      prisma.skillProgress.count({ where: { userId } }),
      prisma.goalProgress.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 5, include: { goal: { select: { title: true } } } }),
      prisma.skillProgress.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 5, include: { skill: { select: { title: true } } } }),
      prisma.goalProgress.findMany({ where: { userId, date: { gte: since } }, select: { date: true, rating: true } }),
      prisma.skillProgress.findMany({ where: { userId, date: { gte: since } }, select: { date: true, rating: true } }),
    ]);

    const totalScore = (goalProgressSum._sum.rating || 0) + (skillProgressSum._sum.rating || 0);

    const byDay = new Map<string, { date: string; goalScore: number; skillScore: number; goalCount: number; skillCount: number }>();
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      const k = dayKey(d);
      byDay.set(k, { date: k, goalScore: 0, skillScore: 0, goalCount: 0, skillCount: 0 });
    }
    for (const p of goalProgressRange) {
      const k = dayKey(new Date(p.date));
      const row = byDay.get(k);
      if (row) { row.goalScore += p.rating; row.goalCount += 1; }
    }
    for (const p of skillProgressRange) {
      const k = dayKey(new Date(p.date));
      const row = byDay.get(k);
      if (row) { row.skillScore += p.rating; row.skillCount += 1; }
    }
    const activitySeries = Array.from(byDay.values());

    return NextResponse.json(
      successResponse(
        { totalScore, goalProgressCount, skillProgressCount, recentGoalProgress, recentSkillProgress, activitySeries },
        "Progress summary retrieved successfully"
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving progress summary:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), { status: 500 });
  }
}
