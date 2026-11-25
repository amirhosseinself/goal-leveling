import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { successResponse, errorResponse } from "@/utils";
import { recordProgressEvent } from "@/lib/gamification";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json(errorResponse([], "Unauthorized", 1), { status: 401 });
    const { skillId, rating, note } = await req.json();
    if (!skillId || typeof rating !== "number" || rating < 1 || rating > 10) {
      return NextResponse.json(errorResponse([{ field: "rating", message: "Rating باید عددی بین 1 تا 10 باشد" }], "Validation Error", 2), { status: 400 });
    }
    const skill = await prisma.skill.findUnique({ where: { id: skillId } });
    if (!skill || !skill.isActive || skill.userId !== session.user.id) return NextResponse.json(errorResponse([], "Skill not found", 3), { status: 404 });

    const progress = await prisma.skillProgress.create({
      data: { userId: session.user.id, skillId, date: new Date(), rating, note: note?.trim() || null },
    });
    const gamification = await recordProgressEvent(session.user.id, { kind: "skill", rating, skillId });
    return NextResponse.json(successResponse({ ...progress, gamification }, "Skill progress added"), { status: 201 });
  } catch (error) {
    console.error("Error creating skill progress:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json(errorResponse([], "Unauthorized", 1), { status: 401 });
    const skillId = new URL(req.url).searchParams.get("skillId");
    if (!skillId) return NextResponse.json(errorResponse([{ field: "skillId", message: "Skill ID is required" }], "Validation Error", 2), { status: 400 });

    const list = await prisma.skillProgress.findMany({
      where: { skillId, userId: session.user.id },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(successResponse(list, "Skill progress retrieved"), { status: 200 });
  } catch (error) {
    console.error("Error fetching skill progress:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json(errorResponse([], "Unauthorized", 1), { status: 401 });
    const { progressId } = await req.json();
    if (!progressId) return NextResponse.json(errorResponse([{ field: "progressId", message: "Progress ID is required" }], "Validation Error", 2), { status: 400 });
    const progress = await prisma.skillProgress.findUnique({ where: { id: progressId } });
    if (!progress || progress.userId !== session.user.id) return NextResponse.json(errorResponse([], "Progress not found", 3), { status: 404 });
    await prisma.skillProgress.delete({ where: { id: progressId } });
    return NextResponse.json(successResponse(null, "Skill progress deleted"), { status: 200 });
  } catch (error) {
    console.error("Error deleting skill progress:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), { status: 500 });
  }
}
