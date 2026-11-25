import { apiClient } from "./apiClient";
import type { SuccessResponse, ErrorResponse } from "@/types/api";

export interface GoalMilestone { id: string; goalId: string; title: string; targetValue?: number | null; done: boolean; order: number; }

const wrap = async <T>(fn: () => Promise<any>): Promise<SuccessResponse<T> | ErrorResponse> => {
  try { const { data } = await fn(); return { status: true, errorCode: null, data: data.data, message: data.message }; }
  catch (e: any) { return { status: false, errorCode: -1, data: null, message: e?.response?.data?.message || e.message, errors: [] }; }
};

export const getMilestones = (goalId: string) => wrap<GoalMilestone[]>(() => apiClient.get(`/goals/milestones?goalId=${goalId}`));
export const createMilestone = (payload: { goalId: string; title: string; targetValue?: number | null; order?: number }) => wrap<GoalMilestone>(() => apiClient.post("/goals/milestones", payload));
export const updateMilestone = (payload: { id: string; done?: boolean; title?: string; targetValue?: number | null }) => wrap<GoalMilestone>(() => apiClient.put("/goals/milestones", payload));
export const deleteMilestone = (id: string) => wrap<null>(() => apiClient.delete("/goals/milestones", { data: { id } }));
