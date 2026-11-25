import { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import type { ErrorResponse, SuccessResponse } from "@/types/api";

interface PostSendOtpProps {
  phoneNumber: string;
}

const postSendOtp = async ({ phoneNumber }: PostSendOtpProps): Promise<SuccessResponse<null> | ErrorResponse> => {
  const url = "/auth/send-otp";
  try {
    const { data } = await apiClient.post(url, { phoneNumber });
    return { status: true, errorCode: null, data: null, message: data?.message || "OTP sent" };
  } catch (err) {
    const error = err as AxiosError<{ message?: string; errorCode?: number; errors?: { field?: string; message: string }[] }>;
    return {
      status: false,
      errorCode: error.response?.data?.errorCode ?? -1,
      data: null,
      message: error.response?.data?.message || error.message || "An error occurred while sending OTP",
      errors: error.response?.data?.errors || [{ message: error.message || "An error occurred while sending OTP" }],
    };
  }
};

export default postSendOtp;
