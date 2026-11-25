import { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import type { SuccessResponse, ErrorResponse } from "@/types/api";

export interface SkillProgress {
  id: string;
  skillId: string;
  userId: string;
  rating: number;
  note?: string | null;
  date: string;
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

export const getSkillProgress = async (skillId: string): Promise<SuccessResponse<SkillProgress[]> | ErrorResponse> => {
  try { const { data } = await apiClient.get(`/skills/progress?skillId=${skillId}`); return { status: true, errorCode: null, data: data.data, message: data.message }; }
  catch (e) { return err(e, "Error fetching skill progress"); }
};

export const createSkillProgress = async (skillId: string, rating: number, note?: string): Promise<SuccessResponse<SkillProgress> | ErrorResponse> => {
  try { const { data } = await apiClient.post("/skills/progress", { skillId, rating, note }); return { status: true, errorCode: null, data: data.data, message: data.message }; }
  catch (e) { return err(e, "Error creating skill progress"); }
};

export const deleteSkillProgress = async (progressId: string): Promise<SuccessResponse<null> | ErrorResponse> => {
  try { const { data } = await apiClient.delete("/skills/progress", { data: { progressId } }); return { status: true, errorCode: null, data: null, message: data.message }; }
  catch (e) { return err(e, "Error deleting skill progress"); }
};
