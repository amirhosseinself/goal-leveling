import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { successResponse, errorResponse } from "@/utils";

export async function PUT(req: NextRequest) {
  try {
    // دریافت سشن کاربر
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(errorResponse([], "Unauthorized", 1), {
        status: 401,
      });
    }

    // پارس کردن اطلاعات ارسال شده
    const body = await req.json();
    const { fullName, userName, bio, profilePic } = body;

    // آماده‌سازی داده‌های به‌روزرسانی
    const updateData: Record<string, unknown> = {};

    if (fullName && fullName.trim() !== "") {
      updateData.fullName = fullName;
    }

    if (userName && userName.trim() !== "") {
      // بررسی یکتایی نام کاربری
      const existingUser = await prisma.user.findUnique({
        where: { userName },
      });

      if (
        existingUser &&
        existingUser.phoneNumber !== session.user.phoneNumber
      ) {
        return NextResponse.json(
          errorResponse(
            [{ field: "userName", message: "Username is already taken" }],
            "Validation Error",
            2
          ),
          { status: 400 }
        );
      }

      updateData.userName = userName;
    }

    if (bio && bio.trim() !== "") {
      updateData.bio = bio;
    }

    if (profilePic && profilePic.trim() !== "") {
      updateData.profilePic = profilePic;
    }

    // بررسی اینکه حداقل یک فیلد برای آپدیت وجود دارد
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        errorResponse([], "No valid fields provided for update", 4),
        { status: 400 }
      );
    }

    // آپدیت اطلاعات کاربر در دیتابیس
    const updatedUser = await prisma.user.update({
      where: { phoneNumber: session.user.phoneNumber },
      data: updateData,
    });

    return NextResponse.json(
      successResponse(updatedUser, "User information updated successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user information:", error);
    return NextResponse.json(errorResponse([], "Internal Server Error", 10), {
      status: 500,
    });
  }
}
