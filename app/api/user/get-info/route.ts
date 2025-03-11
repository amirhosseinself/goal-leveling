import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { successResponse, errorResponse } from "@/utils/";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  try {
    // گرفتن سشن کاربر
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 401), {
        status: 401,
      });
    }

    // واکشی اطلاعات کاربر از دیتابیس با استفاده از شماره تلفن
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        phoneNumber: true,
        userName: true,
        fullName: true,
        profilePic: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // بررسی وجود کاربر
    if (!user) {
      return NextResponse.json(errorResponse([], "User not found", 404), {
        status: 404,
      });
    }

    // بازگرداندن اطلاعات کاربر
    return NextResponse.json(
      successResponse(user, "User information retrieved successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user information:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 500), {
      status: 500,
    });
  }
}
