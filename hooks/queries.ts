"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/query-keys";
import { getGamification } from "@/services/api/gamification";
import { getDailyTasks, createDailyTask, updateDailyTask, deleteDailyTask } from "@/services/api/dailyTasks";
import { getGoals, getGoalById, createGoal, updateGoal, deleteGoal } from "@/services/api/goals";
import { getSkills, getSkillById, createSkill, updateSkill, deleteSkill } from "@/services/api/skills";
import { getProgressSummary } from "@/services/api/progress";
import { getGoalProgress, createGoalProgress } from "@/services/api/goalProgress";
import { getSkillProgress, createSkillProgress, deleteSkillProgress } from "@/services/api/skillProgress";
import { getGoalSkills, linkGoalSkill, unlinkGoalSkill } from "@/services/api/goalSkills";
import { getMilestones, createMilestone, updateMilestone, deleteMilestone } from "@/services/api/milestones";
import getUserInfo from "@/services/api/getUserInfo";
import postUpdateUserInfo from "@/services/api/postUpdateUserInfo";

const unwrap = async <T,>(p: Promise<any>): Promise<T> => {
  const res = await p;
  if (!res?.status) throw new Error(res?.message || "خطا در دریافت اطلاعات");
  return res.data as T;
};

export const useGamification = () => useQuery({ queryKey: qk.gamification, queryFn: () => unwrap(getGamification()) });
export const useGoals = () => useQuery({ queryKey: qk.goals, queryFn: () => unwrap(getGoals()) });
export const useGoal = (id: string) => useQuery({ queryKey: qk.goal(id), queryFn: () => unwrap(getGoalById(id)), enabled: !!id });
export const useSkills = () => useQuery({ queryKey: qk.skills, queryFn: () => unwrap(getSkills()) });
export const useSkill = (id: string) => useQuery({ queryKey: qk.skill(id), queryFn: () => unwrap(getSkillById(id)), enabled: !!id });
export const useProgressSummary = () => useQuery({ queryKey: qk.progressSummary, queryFn: () => unwrap(getProgressSummary()) });
export const useDailyTasks = (date?: string) => useQuery({ queryKey: qk.dailyTasks(date), queryFn: () => unwrap(getDailyTasks(date)) });
export const useGoalProgress = (id: string) => useQuery({ queryKey: qk.goalProgress(id), queryFn: () => unwrap(getGoalProgress(id)), enabled: !!id });
export const useSkillProgress = (id: string) => useQuery({ queryKey: qk.skillProgress(id), queryFn: () => unwrap(getSkillProgress(id)), enabled: !!id });
export const useGoalSkills = (id: string) => useQuery({ queryKey: qk.goalSkills(id), queryFn: () => unwrap(getGoalSkills(id)), enabled: !!id });
export const useMilestones = (id: string) => useQuery({ queryKey: qk.milestones(id), queryFn: () => unwrap(getMilestones(id)), enabled: !!id });
export const useUserInfo = () => useQuery({ queryKey: qk.userInfo, queryFn: () => unwrap(getUserInfo()) });

export const useCreateDailyTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createDailyTask,
    onSuccess: (res) => { if (res.status) qc.invalidateQueries({ queryKey: ["daily-tasks"] }); },
  });
};

export const useUpdateDailyTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateDailyTask,
    onMutate: async (vars: any) => {
      await qc.cancelQueries({ queryKey: ["daily-tasks"] });
      const prev = qc.getQueriesData({ queryKey: ["daily-tasks"] });
      qc.setQueriesData({ queryKey: ["daily-tasks"] }, (old: any) =>
        Array.isArray(old) ? old.map((t) => (t.id === vars.id ? { ...t, ...vars } : t)) : old
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.prev?.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSuccess: (res) => {
      if (res.status) {
        qc.invalidateQueries({ queryKey: ["daily-tasks"] });
        qc.invalidateQueries({ queryKey: qk.gamification });
        qc.invalidateQueries({ queryKey: qk.progressSummary });
      }
    },
  });
};

export const useDeleteDailyTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteDailyTask,
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ["daily-tasks"] });
      const prev = qc.getQueriesData({ queryKey: ["daily-tasks"] });
      qc.setQueriesData({ queryKey: ["daily-tasks"] }, (old: any) => Array.isArray(old) ? old.filter((t) => t.id !== id) : old);
      return { prev };
    },
    onError: (_e, _id, ctx) => { ctx?.prev?.forEach(([key, data]) => qc.setQueryData(key, data)); },
    onSuccess: (res) => { if (res.status) qc.invalidateQueries({ queryKey: ["daily-tasks"] }); },
  });
};

export const useDeleteGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: (res) => { if (res.status) { qc.invalidateQueries({ queryKey: qk.goals }); qc.invalidateQueries({ queryKey: qk.progressSummary }); } },
  });
};

export const useDeleteSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteSkill,
    onSuccess: (res) => { if (res.status) { qc.invalidateQueries({ queryKey: qk.skills }); qc.invalidateQueries({ queryKey: qk.progressSummary }); } },
  });
};

export const useCreateGoal = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createGoal, onSuccess: (res) => { if (res.status) qc.invalidateQueries({ queryKey: qk.goals }); } });
};

export const useUpdateGoal = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: updateGoal, onSuccess: (res, vars: any) => { if (res.status) { qc.invalidateQueries({ queryKey: qk.goals }); if (vars?.goalId) qc.invalidateQueries({ queryKey: qk.goal(vars.goalId) }); } } });
};

export const useCreateSkill = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createSkill, onSuccess: (res) => { if (res.status) qc.invalidateQueries({ queryKey: qk.skills }); } });
};

export const useUpdateSkill = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: updateSkill, onSuccess: (res, vars: any) => { if (res.status) { qc.invalidateQueries({ queryKey: qk.skills }); if (vars?.skillId) qc.invalidateQueries({ queryKey: qk.skill(vars.skillId) }); } } });
};

export const useCreateGoalProgress = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ goalId, rating, note }: { goalId: string; rating: number; note?: string }) => createGoalProgress(goalId, rating, note), onSuccess: (res, vars) => { if (res.status) { qc.invalidateQueries({ queryKey: qk.goalProgress(vars.goalId) }); qc.invalidateQueries({ queryKey: qk.progressSummary }); qc.invalidateQueries({ queryKey: qk.gamification }); qc.invalidateQueries({ queryKey: qk.goals }); } } });
};

export const useCreateSkillProgress = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ skillId, rating, note }: { skillId: string; rating: number; note?: string }) => createSkillProgress(skillId, rating, note), onSuccess: (res, vars) => { if (res.status) { qc.invalidateQueries({ queryKey: qk.skillProgress(vars.skillId) }); qc.invalidateQueries({ queryKey: qk.progressSummary }); qc.invalidateQueries({ queryKey: qk.gamification }); qc.invalidateQueries({ queryKey: qk.skills }); qc.invalidateQueries({ queryKey: qk.skill(vars.skillId) }); } } });
};

export const useDeleteSkillProgress = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id }: { id: string; skillId: string }) => deleteSkillProgress(id), onSuccess: (res, vars) => { if (res.status) { qc.invalidateQueries({ queryKey: qk.skillProgress(vars.skillId) }); qc.invalidateQueries({ queryKey: qk.progressSummary }); } } });
};

export const useLinkGoalSkill = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: linkGoalSkill, onSuccess: (res, vars: any) => { if (res.status) qc.invalidateQueries({ queryKey: qk.goalSkills(vars.goalId) }); } });
};

export const useUnlinkGoalSkill = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id }: { id: string; goalId: string }) => unlinkGoalSkill(id), onSuccess: (res, vars) => { if (res.status) qc.invalidateQueries({ queryKey: qk.goalSkills(vars.goalId) }); } });
};

export const useCreateMilestone = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createMilestone, onSuccess: (res, vars: any) => { if (res.status) qc.invalidateQueries({ queryKey: qk.milestones(vars.goalId) }); } });
};
export const useUpdateMilestone = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: updateMilestone, onSuccess: (res, vars: any) => { if (res.status) qc.invalidateQueries({ queryKey: qk.milestones(vars.goalId) }); } });
};
export const useDeleteMilestone = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id }: { id: string; goalId: string }) => deleteMilestone(id), onSuccess: (res, vars) => { if (res.status) qc.invalidateQueries({ queryKey: qk.milestones(vars.goalId) }); } });
};

export const useUpdateUserInfo = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: postUpdateUserInfo, onSuccess: (res) => { if (res.status) qc.invalidateQueries({ queryKey: qk.userInfo }); } });
};
