import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { successResponse, errorResponse } from "@/utils";

// دریافت لیست مهارت‌های کاربر
export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), {
        status: 401,
      });
    }

    const skills = await prisma.skill.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      successResponse(skills, "Skills retrieved successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), {
      status: 500,
    });
  }
}

// ایجاد یک مهارت جدید
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), {
        status: 401,
      });
    }

    const body = await req.json();
    const { title, description, requiredPoints } = body;

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

    const newSkill = await prisma.skill.create({
      data: {
        title,
        description: description ? description.trim() : null,
        requiredPoints: requiredPoints || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      successResponse(newSkill, "Skill created successfully"),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), {
      status: 500,
    });
  }
}
