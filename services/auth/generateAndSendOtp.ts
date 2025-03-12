import { findUserByPhoneNumber } from "@/services/server/findUserByPhoneNumber";
import { prisma } from "@/lib/prisma";

export async function generateAndSendOTP(phoneNumber: string) {
  // const code = Math.floor(100000 + Math.random() * 900000).toString(); // تولید OTP
  const code = "151515"; // برای تست، از یک مقدار ثابت استفاده می‌کنیم
  const sentAt = new Date(Date.now());
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // انقضا ۵ دقیقه

  // پیدا کردن یا ایجاد کاربر بر اساس شماره تلفن
  let user = await findUserByPhoneNumber(phoneNumber);

  if (!user) {
    user = await prisma.user.create({
      data: {
        phoneNumber,
        createdAt: new Date(),
      },
    });
  }
  // ذخیره OTP در دیتابیس
  await prisma.otp.create({
    data: {
      userId: user.id,
      code,
      sentAt,
      expiresAt,
    },
  });

  //TODO: send otp to user
  // await sendSMS(phoneNumber, `Your OTP is: ${otp}`);
}
