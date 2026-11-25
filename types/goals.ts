import type { Goal as PrismaGoal, GoalProgress as PrismaGoalProgress } from "@prisma/client";

// Re-export Prisma-aligned types for UI/client usage where needed.
export type Goal = PrismaGoal;
export type GoalProgress = PrismaGoalProgress;
