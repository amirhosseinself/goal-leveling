import { NextRequest, NextResponse } from "next/server";
import { generateAndSendOTP } from "@/services/auth/generateAndSendOtp";
import { successResponse, errorResponse } from "@/utils/apiResponses";
import { validatePhoneNumber } from "@/utils/phoneValidation";
import { prisma } from "@/lib/prisma";

// POST request handler
export const POST = async (req: NextRequest) => {
  try {
    const { phoneNumber } = await req.json();

    const result = validatePhoneNumber(phoneNumber);

    if (!result.success) {
      return NextResponse.json(
        errorResponse(
          result.error.errors.map((err) => ({
            field: String(err.path[0]),
            message: err.message,
          })),
          "Invalid phone number.",
          1
        ),
        { status: 400 }
      );
    }

    // بررسی اینکه آیا کدی در 1 دقیقه گذشته ارسال شده است یا خیر
    const recentOtp = await prisma.otp.findFirst({
      where: {
        user: {
          phoneNumber: phoneNumber,
        },
        sentAt: {
          gte: new Date(Date.now() - 60 * 1000), // بررسی ۱ دقیقه گذشته
        },
      },
    });

    if (recentOtp) {
      return NextResponse.json(
        errorResponse([], "You can only request a new OTP after 1 minute.", 2),
        { status: 429 }
      );
    }

    // تولید و ارسال OTP
    await generateAndSendOTP(phoneNumber);

    return NextResponse.json(successResponse(null, "OTP sent successfully."), {
      status: 200,
    });
  } catch (error) {
    console.error("[api/auth/send-otp]", error);
    return NextResponse.json(
      errorResponse(
        [],
        "Internal server Error. An error occurred while sending OTP.",
        10
      ),
      { status: 500 }
    );
  }
};
