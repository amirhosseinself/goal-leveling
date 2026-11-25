import { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import type { SuccessResponse, ErrorResponse } from "@/types/api";
import type { Skill } from "./skills";

export interface GoalSkillLink {
  id: string;
  goalId: string;
  skillId: string;
  impact?: number | null;
  skillPriority?: number | null;
  learningStatus?: "NOT_STARTED" | "IN_PROGRESS" | "MASTERED" | null;
  startDate?: string | null;
  endDate?: string | null;
  skill?: Skill;
}

const err = (e: unknown, fallback: string): ErrorResponse => {
  const error = e as AxiosError<{ message?: string; errorCode?: number; errors?: { field?: string; message: string }[] }>;
  return {
    status: false,
    errorCode: error.response?.data?.errorCode ?? -1,
    data: null,
    message: error.response?.data?.message || error.message || fallback,
    errors: error.response?.data?.errors || [{ message: fallback }],
  };
};

export const getGoalSkills = async (goalId: string): Promise<SuccessResponse<GoalSkillLink[]> | ErrorResponse> => {
  try {
    const { data } = await apiClient.get(`/goals/skills?goalId=${goalId}`);
    return { status: true, errorCode: null, data: data.data, message: data.message };
  } catch (e) { return err(e, "Error fetching goal skills"); }
};

export const linkGoalSkill = async (payload: Omit<GoalSkillLink, "id" | "skill">): Promise<SuccessResponse<GoalSkillLink> | ErrorResponse> => {
  try {
    const { data } = await apiClient.post("/goals/skills", payload);
    return { status: true, errorCode: null, data: data.data, message: data.message };
  } catch (e) { return err(e, "Error linking skill"); }
};

export const updateGoalSkill = async (payload: Partial<GoalSkillLink> & { id: string }): Promise<SuccessResponse<GoalSkillLink> | ErrorResponse> => {
  try {
    const { data } = await apiClient.put("/goals/skills", payload);
    return { status: true, errorCode: null, data: data.data, message: data.message };
  } catch (e) { return err(e, "Error updating goal skill"); }
};

export const unlinkGoalSkill = async (id: string): Promise<SuccessResponse<null> | ErrorResponse> => {
  try {
    const { data } = await apiClient.delete("/goals/skills", { data: { id } });
    return { status: true, errorCode: null, data: null, message: data.message };
  } catch (e) { return err(e, "Error unlinking skill"); }
};
