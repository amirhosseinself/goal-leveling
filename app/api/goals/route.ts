import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { successResponse, errorResponse } from "@/utils";

/**
 * دریافت لیست اهداف کاربر (GET)
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), {
        status: 401,
      });
    }

    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id, isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      successResponse(goals, "Goals retrieved successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), {
      status: 500,
    });
  }
}

/**
 * ایجاد یک هدف جدید (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), {
        status: 401,
      });
    }

    const body = await req.json();
    // خواندن فیلدهای اضافی
    const {
      title,
      description,
      deadline,
      category,
      priority,
      status,
      targetValue,
      currentValue,
    } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json(
        errorResponse(
          [{ field: "title", message: "Title is required" }],
          "Validation Error",
          2
        ),
        { status: 400 }
      );
    }

    const newGoal = await prisma.goal.create({
      data: {
        title,
        description: description?.trim() || null,
        deadline: deadline ? new Date(deadline) : null,
        category: category || null,
        priority: priority || null, // از enum GoalPriority (مثلاً "LOW", "MEDIUM", "HIGH")
        status: status || null, // از enum GoalStatus (مثلاً "IN_PROGRESS", "COMPLETED", ...)
        targetValue: targetValue ?? null,
        currentValue: currentValue ?? null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      successResponse(newGoal, "Goal created successfully"),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), {
      status: 500,
    });
  }
}
