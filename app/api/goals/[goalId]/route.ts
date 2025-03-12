import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { successResponse, errorResponse } from "@/utils";

// دریافت جزئیات یک هدف خاص
export async function GET(
  req: NextRequest,
  { params }: { params: { goalId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), {
        status: 401,
      });
    }

    const { goalId } = params;
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      return NextResponse.json(errorResponse([], "Goal not found", 3), {
        status: 404,
      });
    }

    // اطمینان از اینکه هدف متعلق به کاربر جاری است
    if (goal.userId !== session.user.id) {
      return NextResponse.json(errorResponse([], "Forbidden", 4), {
        status: 403,
      });
    }

    return NextResponse.json(
      successResponse(goal, "Goal retrieved successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving goal:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), {
      status: 500,
    });
  }
}

// به‌روزرسانی یک هدف خاص
export async function PUT(
  req: NextRequest,
  { params }: { params: { goalId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), {
        status: 401,
      });
    }

    const { goalId } = params;
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

    // دریافت هدف جهت اطمینان از مالکیت و وجود
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      return NextResponse.json(errorResponse([], "Goal not found", 3), {
        status: 404,
      });
    }

    if (goal.userId !== session.user.id) {
      return NextResponse.json(errorResponse([], "Forbidden", 4), {
        status: 403,
      });
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        title,
        description: description?.trim() || null,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    return NextResponse.json(
      successResponse(updatedGoal, "Goal updated successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating goal:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), {
      status: 500,
    });
  }
}

// حذف یک هدف خاص
export async function DELETE(
  req: NextRequest,
  { params }: { params: { goalId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), {
        status: 401,
      });
    }

    const { goalId } = params;
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      return NextResponse.json(errorResponse([], "Goal not found", 3), {
        status: 404,
      });
    }

    if (goal.userId !== session.user.id) {
      return NextResponse.json(errorResponse([], "Forbidden", 4), {
        status: 403,
      });
    }

    await prisma.goal.delete({
      where: { id: goalId },
    });

    return NextResponse.json(
      successResponse(null, "Goal deleted successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting goal:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), {
      status: 500,
    });
  }
}
