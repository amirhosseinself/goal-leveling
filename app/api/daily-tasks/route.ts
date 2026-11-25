import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/utils";
import { todayKey, ensureQuests, bumpQuest, awardUserXp, evaluateBadges, updateStreak } from "@/lib/gamification";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json(errorResponse([], "Unauthorized", 1), { status: 401 });
    const dateKey = new URL(req.url).searchParams.get("date") || todayKey();
    const tasks = await prisma.dailyTask.findMany({ where: { userId: session.user.id, dateKey }, orderBy: { createdAt: "asc" } });
    return NextResponse.json(successResponse(tasks, "Daily tasks"));
  } catch (e) {
    console.error(e);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json(errorResponse([], "Unauthorized", 1), { status: 401 });
    const { title, goalId, skillId, dateKey } = await req.json();
    if (!title || !title.trim()) return NextResponse.json(errorResponse([{ field: "title", message: "Title required" }], "Validation Error", 2), { status: 400 });
    const task = await prisma.dailyTask.create({ data: { userId: session.user.id, title: title.trim(), goalId: goalId || null, skillId: skillId || null, dateKey: dateKey || todayKey() } });
    return NextResponse.json(successResponse(task, "Task created"), { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json(errorResponse([], "Unauthorized", 1), { status: 401 });
    const { id, done, title } = await req.json();
    if (!id) return NextResponse.json(errorResponse([{ field: "id", message: "id required" }], "Validation Error", 2), { status: 400 });
    const task = await prisma.dailyTask.findUnique({ where: { id } });
    if (!task || task.userId !== session.user.id) return NextResponse.json(errorResponse([], "Not found", 3), { status: 404 });

    const data: { title?: string; done?: boolean; completedAt?: Date | null } = {};
    if (typeof title === "string") data.title = title.trim();
    if (typeof done === "boolean") { data.done = done; data.completedAt = done ? new Date() : null; }
    const updated = await prisma.dailyTask.update({ where: { id }, data });

    let gamification: { gained: number } | null = null;
    if (typeof done === "boolean" && done && !task.done) {
      await ensureQuests(session.user.id);
      await updateStreak(session.user.id);
      await awardUserXp(session.user.id, updated.xpReward || 10);
      await bumpQuest(session.user.id, "daily_task", "DAILY", 1);
      gamification = { gained: updated.xpReward || 10 };
      await evaluateBadges(session.user.id);
    }
    return NextResponse.json(successResponse({ ...updated, gamification }, "Task updated"));
  } catch (e) {
    console.error(e);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json(errorResponse([], "Unauthorized", 1), { status: 401 });
    const { id } = await req.json();
    if (!id) return NextResponse.json(errorResponse([{ field: "id", message: "id required" }], "Validation Error", 2), { status: 400 });
    const task = await prisma.dailyTask.findUnique({ where: { id } });
    if (!task || task.userId !== session.user.id) return NextResponse.json(errorResponse([], "Not found", 3), { status: 404 });
    await prisma.dailyTask.delete({ where: { id } });
    return NextResponse.json(successResponse(null, "Task deleted"));
  } catch (e) {
    console.error(e);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), { status: 500 });
  }
}
