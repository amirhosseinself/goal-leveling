// services/api/progress.ts
import { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import type { SuccessResponse, ErrorResponse } from "@/types/api";

export interface ProgressSummary {
  totalScore: number;
}

export const getProgressSummary = async (): Promise<
  SuccessResponse<ProgressSummary> | ErrorResponse
> => {
  try {
    const { data, status } = await apiClient.get("/progress");
    if (status === 200) {
      return {
        status: true,
        errorCode: null,
        data: data.data, // انتظار می‌رود ساختار پاسخ به صورت { status, errorCode, message, data } باشد.
        message: data.message,
      } as SuccessResponse<ProgressSummary>;
    } else {
      return {
        status: false,
        errorCode: data.errorCode || -1,
        data: null,
        message: data.message,
        errors: data.errors || [
          { message: "Error retrieving progress summary" },
        ],
      } as ErrorResponse;
    }
  } catch (err) {
    const error = err as AxiosError;
    return {
      status: false,
      errorCode: -1,
      data: null,
      message:
        error.message || "An error occurred while fetching progress summary",
      errors: [
        {
          message:
            error.message ||
            "An error occurred while fetching progress summary",
        },
      ],
    } as ErrorResponse;
  }
};
