export const qk = {
  gamification: ["gamification"] as const,
  goals: ["goals"] as const,
  goal: (id: string) => ["goals", id] as const,
  goalProgress: (id: string) => ["goals", id, "progress"] as const,
  goalSkills: (id: string) => ["goals", id, "skills"] as const,
  milestones: (id: string) => ["goals", id, "milestones"] as const,
  skills: ["skills"] as const,
  skill: (id: string) => ["skills", id] as const,
  skillProgress: (id: string) => ["skills", id, "progress"] as const,
  progressSummary: ["progress-summary"] as const,
  dailyTasks: (date?: string) => ["daily-tasks", date || "today"] as const,
  userInfo: ["user-info"] as const,
};
