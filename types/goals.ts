export interface Goal {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalProgress {
  id: string;
  goalId: string;
  progress: number;
  createdAt: string;
}
