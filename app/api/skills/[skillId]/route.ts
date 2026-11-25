import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { successResponse, errorResponse } from "@/utils";

// دریافت جزئیات یک مهارت خاص
export async function GET(
  req: NextRequest,
  { params }: { params: { skillId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), {
        status: 401,
      });
    }

    const { skillId } = params;
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill || !skill.isActive) {
      return NextResponse.json(errorResponse([], "Skill not found", 3), {
        status: 404,
      });
    }

    if (skill.userId !== session.user.id) {
      return NextResponse.json(errorResponse([], "Forbidden", 4), {
        status: 403,
      });
    }

    return NextResponse.json(
      successResponse(skill, "Skill retrieved successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving skill:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), {
      status: 500,
    });
  }
}

// به‌روزرسانی یک مهارت خاص
export async function PUT(
  req: NextRequest,
  { params }: { params: { skillId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), {
        status: 401,
      });
    }

    const { skillId } = params;
    const body = await req.json();
    const { title, description, requiredPoints, level } = body;

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

    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill || !skill.isActive) {
      return NextResponse.json(errorResponse([], "Skill not found", 3), {
        status: 404,
      });
    }

    if (skill.userId !== session.user.id) {
      return NextResponse.json(errorResponse([], "Forbidden", 4), {
        status: 403,
      });
    }

    const updatedSkill = await prisma.skill.update({
      where: { id: skillId },
      data: {
        title,
        description: description ? description.trim() : null,
        requiredPoints: requiredPoints ?? null,
        level: level || null,
      },
    });

    return NextResponse.json(
      successResponse(updatedSkill, "Skill updated successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), {
      status: 500,
    });
  }
}

// حذف یک مهارت خاص
export async function DELETE(
  req: NextRequest,
  { params }: { params: { skillId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), {
        status: 401,
      });
    }

    const { skillId } = params;
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill || !skill.isActive) {
      return NextResponse.json(errorResponse([], "Skill not found", 3), {
        status: 404,
      });
    }

    if (skill.userId !== session.user.id) {
      return NextResponse.json(errorResponse([], "Forbidden", 4), {
        status: 403,
      });
    }

    await prisma.skill.update({
      where: { id: skillId },
      data: { isActive: false },
    });

    return NextResponse.json(
      successResponse(null, "Skill deleted successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), {
      status: 500,
    });
  }
}
