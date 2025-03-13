import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { successResponse, errorResponse } from "@/utils";

/**
 * ثبت پیشرفت جدید (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), {
        status: 401,
      });
    }

    const { goalId, rating, note } = await req.json();

    if (!goalId || typeof rating !== "number" || rating < 1 || rating > 10) {
      return NextResponse.json(
        errorResponse(
          [{ field: "rating", message: "Rating باید عددی بین 1 تا 10 باشد" }],
          "Validation Error",
          2
        ),
        { status: 400 }
      );
    }

    const newProgress = await prisma.goalProgress.create({
      data: {
        userId: session.user.id,
        goalId,
        date: new Date(),
        rating,
        note: note?.trim() || null,
      },
    });

    return NextResponse.json(
      successResponse(newProgress, "Progress added successfully"),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating progress:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), {
      status: 500,
    });
  }
}

/**
 * دریافت لیست پیشرفت‌های یک هدف خاص (GET)
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const goalId = url.searchParams.get("goalId");

    if (!goalId) {
      return NextResponse.json(
        errorResponse(
          [{ field: "goalId", message: "Goal ID is required" }],
          "Validation Error",
          2
        ),
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), {
        status: 401,
      });
    }

    const progressList = await prisma.goalProgress.findMany({
      where: { goalId, userId: session.user.id },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(
      successResponse(progressList, "Progress retrieved successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), {
      status: 500,
    });
  }
}

/**
 * حذف یک پیشرفت خاص (DELETE)
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), {
        status: 401,
      });
    }

    const { progressId } = await req.json();

    if (!progressId) {
      return NextResponse.json(
        errorResponse(
          [{ field: "progressId", message: "Progress ID is required" }],
          "Validation Error",
          2
        ),
        { status: 400 }
      );
    }

    const progress = await prisma.goalProgress.findUnique({
      where: { id: progressId },
    });

    if (!progress || progress.userId !== session.user.id) {
      return NextResponse.json(errorResponse([], "Progress not found", 3), {
        status: 404,
      });
    }

    await prisma.goalProgress.delete({ where: { id: progressId } });

    return NextResponse.json(
      successResponse(null, "Progress deleted successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting progress:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), {
      status: 500,
    });
  }
}
