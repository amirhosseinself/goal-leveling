import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

import { validateOtpAndLogin } from "@/services/auth/validateOtpAndLogin";
import { Role } from "@/types/types";

// TODO: Add zod for input validation

export default {
  providers: [
    Credentials({
      name: "OTP",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
        otpCode: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        const { phoneNumber, otpCode } = credentials as {
          phoneNumber: string;
          otpCode: string;
        };

        if (!phoneNumber || !otpCode) {
          console.log("[auth.config.ts] Phone number or OTP code is missing.");
          return null;
        }
        // Validate OTP from the database
        const result = await validateOtpAndLogin(phoneNumber, otpCode);

        if (!result) {
          console.log("[auth.config.ts] Invalid or expired OTP code.");
          return null;
        }
        const user = result;
        if (!user) {
          console.log("[auth.config.ts] User not found.");
          return null;
        }
        return {
          id: user.id,
          phoneNumber: user.phoneNumber,
          role: user.role as Role,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
