import { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import type { SuccessResponse, ErrorResponse } from "@/types/api";

/**
 * تعریف تایپ GoalProgress مطابق با داده‌های دریافتی از سرور
 */
export interface GoalProgress {
  id: string;
  goalId: string;
  userId: string;
  rating: number;
  note?: string;
  date: string;
}

/**
 * دریافت لیست پیشرفت‌های یک هدف خاص
 * @param goalId - شناسه هدف
 */
export const getGoalProgress = async (
  goalId: string
): Promise<SuccessResponse<GoalProgress[]> | ErrorResponse> => {
  try {
    const { data, status } = await apiClient.get(
      `/goals/progress?goalId=${goalId}`
    );
    if (status === 200) {
      return {
        status: true,
        errorCode: null,
        data: data.data,
        message: data.message,
      } as SuccessResponse<GoalProgress[]>;
    } else {
      return {
        status: false,
        errorCode: data.errorCode || -1,
        data: null,
        message: data.message,
        errors: data.errors || [{ message: "Error retrieving goal progress" }],
      } as ErrorResponse;
    }
  } catch (err) {
    const error = err as AxiosError;
    return {
      status: false,
      errorCode: -1,
      data: null,
      message:
        error.message || "An error occurred while fetching goal progress",
      errors: [
        {
          message:
            error.message || "An error occurred while fetching goal progress",
        },
      ],
    } as ErrorResponse;
  }
};

/**
 * ایجاد پیشرفت جدید برای هدف
 * @param goalId - شناسه هدف
 * @param rating - امتیاز پیشرفت (1 تا 10)
 * @param note - توضیحات اختیاری
 */
export const createGoalProgress = async (
  goalId: string,
  rating: number,
  note?: string
): Promise<SuccessResponse<GoalProgress> | ErrorResponse> => {
  try {
    const { data, status } = await apiClient.post("/goals/progress", {
      goalId,
      rating,
      note,
    });

    if (status === 201) {
      return {
        status: true,
        errorCode: null,
        data: data.data,
        message: data.message,
      } as SuccessResponse<GoalProgress>;
    } else {
      return {
        status: false,
        errorCode: data.errorCode || -1,
        data: null,
        message: data.message,
        errors: data.errors || [{ message: "Error creating goal progress" }],
      } as ErrorResponse;
    }
  } catch (err) {
    const error = err as AxiosError;
    return {
      status: false,
      errorCode: -1,
      data: null,
      message:
        error.message || "An error occurred while creating goal progress",
      errors: [
        {
          message:
            error.message || "An error occurred while creating goal progress",
        },
      ],
    } as ErrorResponse;
  }
};

/**
 * حذف یک پیشرفت خاص
 * @param progressId - شناسه پیشرفت
 */
export const deleteGoalProgress = async (
  progressId: string
): Promise<SuccessResponse<null> | ErrorResponse> => {
  try {
    const { data, status } = await apiClient.delete("/goals/progress", {
      data: { progressId },
    });

    if (status === 200) {
      return {
        status: true,
        errorCode: null,
        data: null,
        message: data.message,
      } as SuccessResponse<null>;
    } else {
      return {
        status: false,
        errorCode: data.errorCode || -1,
        data: null,
        message: data.message,
        errors: data.errors || [{ message: "Error deleting goal progress" }],
      } as ErrorResponse;
    }
  } catch (err) {
    const error = err as AxiosError;
    return {
      status: false,
      errorCode: -1,
      data: null,
      message:
        error.message || "An error occurred while deleting goal progress",
      errors: [
        {
          message:
            error.message || "An error occurred while deleting goal progress",
        },
      ],
    } as ErrorResponse;
  }
};
