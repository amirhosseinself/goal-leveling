import { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import type { SuccessResponse, ErrorResponse } from "@/types/api";

// تعریف تایپ هدف (Goal) مطابق ساختار داده‌ی برگردانده شده از سرور
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
}

// دریافت لیست اهداف
export const getGoals = async (): Promise<
  SuccessResponse<Goal[]> | ErrorResponse
> => {
  try {
    const { data, status } = await apiClient.get("/api/goals");
    if (status === 200) {
      return {
        status: true,
        errorCode: null,
        data: data.data, // فرض می‌شود که ساختار پاسخ { status, errorCode, message, data } است.
        message: data.message,
      } as SuccessResponse<Goal[]>;
    } else {
      return {
        status: false,
        errorCode: data.errorCode || -1,
        data: null,
        message: data.message,
        errors: data.errors || [{ message: "Error retrieving goals" }],
      } as ErrorResponse;
    }
  } catch (err) {
    const error = err as AxiosError;
    return {
      status: false,
      errorCode: -1,
      data: null,
      message: error.message || "An error occurred while fetching goals",
      errors: [
        { message: error.message || "An error occurred while fetching goals" },
      ],
    } as ErrorResponse;
  }
};

// ایجاد یک هدف جدید
interface CreateGoalProps {
  title: string;
  description?: string;
  deadline?: string; // تاریخ به صورت رشته ISO یا فرمت دلخواه
}
export const createGoal = async (
  goalData: CreateGoalProps
): Promise<SuccessResponse<Goal> | ErrorResponse> => {
  try {
    const { data, status } = await apiClient.post("/api/goals", goalData);
    if (status === 201) {
      return {
        status: true,
        errorCode: null,
        data: data.data,
        message: data.message,
      } as SuccessResponse<Goal>;
    } else {
      return {
        status: false,
        errorCode: data.errorCode || -1,
        data: null,
        message: data.message,
        errors: data.errors || [{ message: "Error creating goal" }],
      } as ErrorResponse;
    }
  } catch (err) {
    const error = err as AxiosError;
    return {
      status: false,
      errorCode: -1,
      data: null,
      message: error.message || "An error occurred while creating goal",
      errors: [
        { message: error.message || "An error occurred while creating goal" },
      ],
    } as ErrorResponse;
  }
};

// دریافت جزئیات یک هدف خاص
export const getGoalById = async (
  goalId: string
): Promise<SuccessResponse<Goal> | ErrorResponse> => {
  try {
    const { data, status } = await apiClient.get(`/api/goals/${goalId}`);
    if (status === 200) {
      return {
        status: true,
        errorCode: null,
        data: data.data,
        message: data.message,
      } as SuccessResponse<Goal>;
    } else {
      return {
        status: false,
        errorCode: data.errorCode || -1,
        data: null,
        message: data.message,
        errors: data.errors || [{ message: "Error retrieving goal" }],
      } as ErrorResponse;
    }
  } catch (err) {
    const error = err as AxiosError;
    return {
      status: false,
      errorCode: -1,
      data: null,
      message: error.message || "An error occurred while fetching goal",
      errors: [
        { message: error.message || "An error occurred while fetching goal" },
      ],
    } as ErrorResponse;
  }
};

// به‌روزرسانی یک هدف خاص
interface UpdateGoalProps {
  goalId: string;
  title: string;
  description?: string;
  deadline?: string;
}
export const updateGoal = async ({
  goalId,
  title,
  description,
  deadline,
}: UpdateGoalProps): Promise<SuccessResponse<Goal> | ErrorResponse> => {
  try {
    const { data, status } = await apiClient.put(`/api/goals/${goalId}`, {
      title,
      description,
      deadline,
    });
    if (status === 200) {
      return {
        status: true,
        errorCode: null,
        data: data.data,
        message: data.message,
      } as SuccessResponse<Goal>;
    } else {
      return {
        status: false,
        errorCode: data.errorCode || -1,
        data: null,
        message: data.message,
        errors: data.errors || [{ message: "Error updating goal" }],
      } as ErrorResponse;
    }
  } catch (err) {
    const error = err as AxiosError;
    return {
      status: false,
      errorCode: -1,
      data: null,
      message: error.message || "An error occurred while updating goal",
      errors: [
        { message: error.message || "An error occurred while updating goal" },
      ],
    } as ErrorResponse;
  }
};

// حذف یک هدف
export const deleteGoal = async (
  goalId: string
): Promise<SuccessResponse<null> | ErrorResponse> => {
  try {
    const { data, status } = await apiClient.delete(`/api/goals/${goalId}`);
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
        errors: data.errors || [{ message: "Error deleting goal" }],
      } as ErrorResponse;
    }
  } catch (err) {
    const error = err as AxiosError;
    return {
      status: false,
      errorCode: -1,
      data: null,
      message: error.message || "An error occurred while deleting goal",
      errors: [
        { message: error.message || "An error occurred while deleting goal" },
      ],
    } as ErrorResponse;
  }
};
