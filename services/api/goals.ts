import { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import type { SuccessResponse, ErrorResponse } from "@/types/api";
// ایمپورت مدل Goal از Prisma Client (بعد از اجرای npx prisma generate)
import { Goal } from "@prisma/client";

// ایجاد یک تایپ برای ورودی ایجاد هدف جدید
interface CreateGoalProps {
  title: string;
  description?: string;
  deadline?: string | null;
  category?: string | null;
  priority?: string | null;
  status?: string | null;
  targetValue?: number | null;
  currentValue?: number | null;
}

export const getGoals = async (): Promise<
  SuccessResponse<Goal[]> | ErrorResponse
> => {
  try {
    const { data, status } = await apiClient.get("/goals");
    if (status === 200) {
      return {
        status: true,
        errorCode: null,
        data: data.data, // انتظار ساختار { status, errorCode, message, data }
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

export const createGoal = async (
  goalData: CreateGoalProps
): Promise<SuccessResponse<Goal> | ErrorResponse> => {
  try {
    const { data, status } = await apiClient.post("/goals", goalData);
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

export const getGoalById = async (
  goalId: string
): Promise<SuccessResponse<Goal> | ErrorResponse> => {
  try {
    const { data, status } = await apiClient.get(`/goals/${goalId}`);
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

interface UpdateGoalProps {
  goalId: string;
  title: string;
  description?: string;
  deadline?: string | null;
  category?: string | null;
  priority?: string | null;
  status?: string | null;
  targetValue?: number | null;
  currentValue?: number | null;
}

export const updateGoal = async ({
  goalId,
  title,
  description,
  deadline,
  category,
  priority,
  status,
  targetValue,
  currentValue,
}: UpdateGoalProps): Promise<SuccessResponse<Goal> | ErrorResponse> => {
  try {
    const { data, status: resStatus } = await apiClient.put(
      `/goals/${goalId}`,
      {
        title,
        description,
        deadline,
        category,
        priority,
        status,
        targetValue,
        currentValue,
      }
    );
    if (resStatus === 200) {
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

export const deleteGoal = async (
  goalId: string
): Promise<SuccessResponse<null> | ErrorResponse> => {
  try {
    const { data, status: resStatus } = await apiClient.delete(
      `/goals/${goalId}`
    );
    if (resStatus === 200) {
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
