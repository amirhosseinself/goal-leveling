import { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import type { SuccessResponse, ErrorResponse } from "@/types/api";

// تعریف تایپ اطلاعات کاربر
export interface UserInfo {
  id: string;
  phoneNumber: string;
  userName: string | null;
  fullName: string | null;
  profilePic: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

const getUserInfo = async (): Promise<
  SuccessResponse<UserInfo> | ErrorResponse
> => {
  const url = "/user/get-info";

  try {
    const { data, status } = await apiClient.get(url);
    console.log("[getUserInfo] Response:", data, status);

    if (status === 200) {
      // فرض بر این است که ساختار داده دریافتی به صورت { status, errorCode, message, data } است.
      return {
        status: true,
        errorCode: null,
        data: data.data, // اینجا داده واقعی کاربر رو بر اساس تایپ UserInfo قرار می‌دهیم
      } as SuccessResponse<UserInfo>;
    } else {
      console.error("[getUserInfo] Error:", data);
      return {
        status: false,
        errorCode: data.errorCode || -1,
        message: data.message,
        data: null,
        errors: data.errors || [{ message: "An error occurred" }],
      } as ErrorResponse;
    }
  } catch (err) {
    const error = err as AxiosError;
    console.error("[getUserInfo] Axios error:", error.message);
    return {
      status: false,
      errorCode: -1,
      message: error.message || "An error occurred while sending OTP",
      data: null,
      errors: [
        { message: error.message || "An error occurred while sending OTP" },
      ],
    } as ErrorResponse;
  }
};

export default getUserInfo;
