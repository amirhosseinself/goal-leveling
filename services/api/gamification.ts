import { apiClient } from "./apiClient";
import type { SuccessResponse, ErrorResponse } from "@/types/api";

export interface Badge { id: string; badgeKey: string; title: string; description?: string | null; earnedAt: string; }
export interface Quest { id: string; questKey: string; type: "DAILY" | "WEEKLY"; periodKey: string; title: string; description?: string | null; target: number; progress: number; xpReward: number; status: "ACTIVE" | "COMPLETED" | "CLAIMED"; }
export interface GamificationSummary { xp: number; level: number; nextLevelXp: number; levelProgress: number; streakCount: number; longestStreak: number; badges: Badge[]; dailyQuests: Quest[]; weeklyQuests: Quest[]; }

export const getGamification = async (): Promise<SuccessResponse<GamificationSummary> | ErrorResponse> => {
  try { const { data } = await apiClient.get("/gamification"); return { status: true, errorCode: null, data: data.data, message: data.message }; }
  catch (e: any) { return { status: false, errorCode: -1, data: null, message: e?.response?.data?.message || e.message, errors: [] }; }
};
