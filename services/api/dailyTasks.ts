import { apiClient } from "./apiClient";
import type { SuccessResponse, ErrorResponse } from "@/types/api";

export interface DailyTask { id: string; dateKey: string; title: string; done: boolean; goalId?: string | null; skillId?: string | null; xpReward: number; completedAt?: string | null; gamification?: { gained: number }; }
export interface DailyHistoryPoint { date: string; done: number; total: number; }
export interface DailyTasksResponse { tasks: DailyTask[]; history: DailyHistoryPoint[]; }

const wrap = async <T>(fn: () => Promise<any>): Promise<SuccessResponse<T> | ErrorResponse> => {
  try { const { data } = await fn(); return { status: true, errorCode: null, data: data.data, message: data.message }; }
  catch (e: any) { return { status: false, errorCode: -1, data: null, message: e?.response?.data?.message || e.message, errors: [] }; }
};

export const getDailyTasks = (date?: string, historyDays = 7) => wrap<DailyTasksResponse>(() => apiClient.get(`/daily-tasks?${new URLSearchParams({ ...(date ? { date } : {}), historyDays: String(historyDays) }).toString()}`));
export const createDailyTask = (payload: { title: string; goalId?: string; skillId?: string; dateKey?: string }) => wrap<DailyTask>(() => apiClient.post("/daily-tasks", payload));
export const updateDailyTask = (payload: { id: string; done?: boolean; title?: string }) => wrap<DailyTask>(() => apiClient.put("/daily-tasks", payload));
export const deleteDailyTask = (id: string) => wrap<null>(() => apiClient.delete("/daily-tasks", { data: { id } }));
