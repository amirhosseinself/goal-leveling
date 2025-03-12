// /api/progress/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { successResponse, errorResponse } from "@/utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), {
        status: 401,
      });
    }

    // محاسبه مجموع امتیازهای ثبت‌شده در اهداف
    const goalProgressSum = await prisma.goalProgress.aggregate({
      _sum: { rating: true },
      where: { userId: session.user.id },
    });
    // محاسبه مجموع امتیازهای ثبت‌شده در مهارت‌ها
    const skillProgressSum = await prisma.skillProgress.aggregate({
      _sum: { rating: true },
      where: { userId: session.user.id },
    });

    const totalScore =
      (goalProgressSum._sum.rating || 0) + (skillProgressSum._sum.rating || 0);

    return NextResponse.json(
      successResponse(
        { totalScore },
        "Progress summary retrieved successfully"
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving progress summary:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), {
      status: 500,
    });
  }
}
