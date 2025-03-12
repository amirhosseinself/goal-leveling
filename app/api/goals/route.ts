import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { successResponse, errorResponse } from "@/utils";

/**
 * دریافت لیست اهداف کاربر (GET)
 */
export async function GET() {
  try {
    // دریافت سشن کاربر
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), {
        status: 401,
      });
    }

    // دریافت لیست اهداف از دیتابیس
    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      successResponse(goals, "Goals retrieved successfully"),
      {
        status: 200,
      }
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
    // دریافت سشن کاربر
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), {
        status: 401,
      });
    }

    // دریافت داده‌های ورودی
    const body = await req.json();
    const { title, description, deadline } = body;

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

    // ایجاد هدف جدید
    const newGoal = await prisma.goal.create({
      data: {
        title,
        description: description?.trim() || null,
        deadline: deadline ? new Date(deadline) : null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      successResponse(newGoal, "Goal created successfully"),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), {
      status: 500,
    });
  }
}
