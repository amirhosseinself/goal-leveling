import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json(errorResponse([], "Unauthorized", 1), { status: 401 });
    const goalId = new URL(req.url).searchParams.get("goalId");
    if (!goalId) return NextResponse.json(errorResponse([{ field: "goalId", message: "goalId required" }], "Validation Error", 2), { status: 400 });
    const goal = await prisma.goal.findUnique({ where: { id: goalId } });
    if (!goal || goal.userId !== session.user.id) return NextResponse.json(errorResponse([], "Not found", 3), { status: 404 });
    const milestones = await prisma.goalMilestone.findMany({ where: { goalId }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
    return NextResponse.json(successResponse(milestones, "Milestones"));
  } catch (e) { console.error(e); return NextResponse.json(errorResponse([], "Internal Server Error", 10), { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json(errorResponse([], "Unauthorized", 1), { status: 401 });
    const { goalId, title, targetValue, order } = await req.json();
    if (!goalId || !title?.trim()) return NextResponse.json(errorResponse([{ field: "title", message: "title required" }], "Validation Error", 2), { status: 400 });
    const goal = await prisma.goal.findUnique({ where: { id: goalId } });
    if (!goal || goal.userId !== session.user.id) return NextResponse.json(errorResponse([], "Not found", 3), { status: 404 });
    const ms = await prisma.goalMilestone.create({ data: { goalId, title: title.trim(), targetValue: targetValue ?? null, order: order ?? 0 } });
    return NextResponse.json(successResponse(ms, "Milestone created"), { status: 201 });
  } catch (e) { console.error(e); return NextResponse.json(errorResponse([], "Internal Server Error", 10), { status: 500 }); }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json(errorResponse([], "Unauthorized", 1), { status: 401 });
    const { id, done, title, targetValue } = await req.json();
    const ms = await prisma.goalMilestone.findUnique({ where: { id }, include: { goal: true } });
    if (!ms || ms.goal.userId !== session.user.id) return NextResponse.json(errorResponse([], "Not found", 3), { status: 404 });
    const data: { done?: boolean; title?: string; targetValue?: number | null } = {};
    if (typeof done === "boolean") data.done = done;
    if (typeof title === "string") data.title = title.trim();
    if (targetValue !== undefined) data.targetValue = targetValue;
    const updated = await prisma.goalMilestone.update({ where: { id }, data });
    return NextResponse.json(successResponse(updated, "Milestone updated"));
  } catch (e) { console.error(e); return NextResponse.json(errorResponse([], "Internal Server Error", 10), { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json(errorResponse([], "Unauthorized", 1), { status: 401 });
    const { id } = await req.json();
    const ms = await prisma.goalMilestone.findUnique({ where: { id }, include: { goal: true } });
    if (!ms || ms.goal.userId !== session.user.id) return NextResponse.json(errorResponse([], "Not found", 3), { status: 404 });
    await prisma.goalMilestone.delete({ where: { id } });
    return NextResponse.json(successResponse(null, "Milestone deleted"));
  } catch (e) { console.error(e); return NextResponse.json(errorResponse([], "Internal Server Error", 10), { status: 500 }); }
}
