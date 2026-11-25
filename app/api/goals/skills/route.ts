import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { successResponse, errorResponse } from "@/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json(errorResponse([], "Unauthorized", 1), { status: 401 });

    const goalId = new URL(req.url).searchParams.get("goalId");
    if (!goalId) return NextResponse.json(errorResponse([{ field: "goalId", message: "Goal ID is required" }], "Validation Error", 2), { status: 400 });

    const goal = await prisma.goal.findUnique({ where: { id: goalId } });
    if (!goal || !goal.isActive || goal.userId !== session.user.id) {
      return NextResponse.json(errorResponse([], "Goal not found", 3), { status: 404 });
    }

    const links = await prisma.goalSkill.findMany({
      where: { goalId },
      include: { skill: true },
      orderBy: { id: "desc" },
    });
    return NextResponse.json(successResponse(links, "Goal skills retrieved successfully"), { status: 200 });
  } catch (error) {
    console.error("Error fetching goal skills:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json(errorResponse([], "Unauthorized", 1), { status: 401 });

    const body = await req.json();
    const { goalId, skillId, impact, skillPriority, learningStatus, startDate, endDate } = body;
    if (!goalId || !skillId) {
      return NextResponse.json(errorResponse([{ field: "goalId/skillId", message: "goalId and skillId are required" }], "Validation Error", 2), { status: 400 });
    }

    const [goal, skill] = await Promise.all([
      prisma.goal.findUnique({ where: { id: goalId } }),
      prisma.skill.findUnique({ where: { id: skillId } }),
    ]);
    if (!goal || !goal.isActive || goal.userId !== session.user.id) return NextResponse.json(errorResponse([], "Goal not found", 3), { status: 404 });
    if (!skill || !skill.isActive || skill.userId !== session.user.id) return NextResponse.json(errorResponse([], "Skill not found", 3), { status: 404 });

    const existing = await prisma.goalSkill.findFirst({ where: { goalId, skillId } });
    if (existing) return NextResponse.json(errorResponse([], "Skill already linked to goal", 4), { status: 409 });

    const link = await prisma.goalSkill.create({
      data: {
        goalId,
        skillId,
        impact: impact ?? null,
        skillPriority: skillPriority ?? null,
        learningStatus: learningStatus ?? null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: { skill: true },
    });
    return NextResponse.json(successResponse(link, "Skill linked to goal"), { status: 201 });
  } catch (error) {
    console.error("Error linking goal skill:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json(errorResponse([], "Unauthorized", 1), { status: 401 });
    const { id, impact, skillPriority, learningStatus, startDate, endDate } = await req.json();
    if (!id) return NextResponse.json(errorResponse([{ field: "id", message: "id is required" }], "Validation Error", 2), { status: 400 });

    const link = await prisma.goalSkill.findUnique({ where: { id }, include: { goal: true } });
    if (!link || link.goal.userId !== session.user.id) return NextResponse.json(errorResponse([], "Link not found", 3), { status: 404 });

    const updated = await prisma.goalSkill.update({
      where: { id },
      data: {
        impact: impact ?? null,
        skillPriority: skillPriority ?? null,
        learningStatus: learningStatus ?? null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: { skill: true },
    });
    return NextResponse.json(successResponse(updated, "Goal skill updated"), { status: 200 });
  } catch (error) {
    console.error("Error updating goal skill:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json(errorResponse([], "Unauthorized", 1), { status: 401 });
    const { id } = await req.json();
    if (!id) return NextResponse.json(errorResponse([{ field: "id", message: "id is required" }], "Validation Error", 2), { status: 400 });

    const link = await prisma.goalSkill.findUnique({ where: { id }, include: { goal: true } });
    if (!link || link.goal.userId !== session.user.id) return NextResponse.json(errorResponse([], "Link not found", 3), { status: 404 });

    await prisma.goalSkill.delete({ where: { id } });
    return NextResponse.json(successResponse(null, "Goal skill removed"), { status: 200 });
  } catch (error) {
    console.error("Error deleting goal skill:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), { status: 500 });
  }
}
