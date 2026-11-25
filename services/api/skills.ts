// services/skills.ts
import { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import type { SuccessResponse, ErrorResponse } from "@/types/api";

// تعریف تایپ Skill مطابق ساختار داده‌های برگردانده شده از سرور
export interface Skill {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  requiredPoints: number | null;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | null;
  xp?: number;
  masteryLevel?: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

// دریافت لیست مهارت‌ها
export const getSkills = async (): Promise<
  SuccessResponse<Skill[]> | ErrorResponse
> => {
  try {
    const { data, status } = await apiClient.get("/skills");
    if (status === 200) {
      return {
        status: true,
        errorCode: null,
        data: data.data, // فرض بر این است که ساختار پاسخ { status, errorCode, message, data } است.
        message: data.message,
      } as SuccessResponse<Skill[]>;
    } else {
      return {
        status: false,
        errorCode: data.errorCode || -1,
        data: null,
        message: data.message,
        errors: data.errors || [{ message: "Error retrieving skills" }],
      } as ErrorResponse;
    }
  } catch (err) {
    const error = err as AxiosError;
    return {
      status: false,
      errorCode: -1,
      data: null,
      message: error.message || "An error occurred while fetching skills",
      errors: [
        { message: error.message || "An error occurred while fetching skills" },
      ],
    } as ErrorResponse;
  }
};

// ایجاد یک مهارت جدید
interface CreateSkillProps {
  title: string;
  description?: string;
  requiredPoints?: number | null;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | null;
}

export const createSkill = async (
  skillData: CreateSkillProps
): Promise<SuccessResponse<Skill> | ErrorResponse> => {
  try {
    const { data, status } = await apiClient.post("/skills", skillData);
    if (status === 201) {
      return {
        status: true,
        errorCode: null,
        data: data.data,
        message: data.message,
      } as SuccessResponse<Skill>;
    } else {
      return {
        status: false,
        errorCode: data.errorCode || -1,
        data: null,
        message: data.message,
        errors: data.errors || [{ message: "Error creating skill" }],
      } as ErrorResponse;
    }
  } catch (err) {
    const error = err as AxiosError;
    return {
      status: false,
      errorCode: -1,
      data: null,
      message: error.message || "An error occurred while creating skill",
      errors: [
        { message: error.message || "An error occurred while creating skill" },
      ],
    } as ErrorResponse;
  }
};

// دریافت جزئیات یک مهارت بر اساس آی‌دی
export const getSkillById = async (
  skillId: string
): Promise<SuccessResponse<Skill> | ErrorResponse> => {
  try {
    const { data, status } = await apiClient.get(`/skills/${skillId}`);
    if (status === 200) {
      return {
        status: true,
        errorCode: null,
        data: data.data,
        message: data.message,
      } as SuccessResponse<Skill>;
    } else {
      return {
        status: false,
        errorCode: data.errorCode || -1,
        data: null,
        message: data.message,
        errors: data.errors || [{ message: "Error retrieving skill" }],
      } as ErrorResponse;
    }
  } catch (err) {
    const error = err as AxiosError;
    return {
      status: false,
      errorCode: -1,
      data: null,
      message: error.message || "An error occurred while fetching skill",
      errors: [
        { message: error.message || "An error occurred while fetching skill" },
      ],
    } as ErrorResponse;
  }
};

// به‌روزرسانی یک مهارت
interface UpdateSkillProps {
  skillId: string;
  title: string;
  description?: string;
  requiredPoints?: number | null;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | null;
}

export const updateSkill = async ({
  skillId,
  title,
  description,
  requiredPoints,
  level,
}: UpdateSkillProps): Promise<SuccessResponse<Skill> | ErrorResponse> => {
  try {
    const { data, status } = await apiClient.put(`/skills/${skillId}`, {
      title,
      description,
      requiredPoints,
      level,
    });
    if (status === 200) {
      return {
        status: true,
        errorCode: null,
        data: data.data,
        message: data.message,
      } as SuccessResponse<Skill>;
    } else {
      return {
        status: false,
        errorCode: data.errorCode || -1,
        data: null,
        message: data.message,
        errors: data.errors || [{ message: "Error updating skill" }],
      } as ErrorResponse;
    }
  } catch (err) {
    const error = err as AxiosError;
    return {
      status: false,
      errorCode: -1,
      data: null,
      message: error.message || "An error occurred while updating skill",
      errors: [
        { message: error.message || "An error occurred while updating skill" },
      ],
    } as ErrorResponse;
  }
};

// حذف یک مهارت
export const deleteSkill = async (
  skillId: string
): Promise<SuccessResponse<null> | ErrorResponse> => {
  try {
    const { data, status } = await apiClient.delete(`/skills/${skillId}`);
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
        errors: data.errors || [{ message: "Error deleting skill" }],
      } as ErrorResponse;
    }
  } catch (err) {
    const error = err as AxiosError;
    return {
      status: false,
      errorCode: -1,
      data: null,
      message: error.message || "An error occurred while deleting skill",
      errors: [
        { message: error.message || "An error occurred while deleting skill" },
      ],
    } as ErrorResponse;
  }
};
