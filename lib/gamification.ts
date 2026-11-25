import { prisma } from "@/lib/prisma";

export const levelFromXp = (xp: number) => Math.floor(Math.sqrt(xp / 80)) + 1;
export const xpForNextLevel = (level: number) => Math.pow(level, 2) * 80;

export const todayKey = (d = new Date()) => d.toISOString().slice(0, 10);
export const weekKey = (d = new Date()) => {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
};

const diffDays = (a: string, b: string) => {
  const da = new Date(a + "T00:00:00Z").getTime();
  const db = new Date(b + "T00:00:00Z").getTime();
  return Math.round((db - da) / 86400000);
};

export async function getOrCreateGamification(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  return user;
}

export async function updateStreak(userId: string) {
  const user = await getOrCreateGamification(userId);
  const tk = todayKey();
  const last = user.lastActiveDate ? todayKey(new Date(user.lastActiveDate)) : null;
  let streak = user.streakCount || 0;
  if (last === tk) {
    // already active today
  } else if (last && diffDays(last, tk) === 1) {
    streak += 1;
  } else {
    streak = 1;
  }
  const longest = Math.max(user.longestStreak || 0, streak);
  await prisma.user.update({ where: { id: userId }, data: { streakCount: streak, longestStreak: longest, lastActiveDate: new Date() } });
  return { streak, longest, streakBonus: Math.min(streak, 7) * 2 };
}

export async function awardUserXp(userId: string, amount: number) {
  const user = await getOrCreateGamification(userId);
  const xp = (user.xp || 0) + Math.max(0, Math.round(amount));
  const level = levelFromXp(xp);
  const updated = await prisma.user.update({ where: { id: userId }, data: { xp, level } });
  return { xp: updated.xp, level: updated.level, gained: Math.max(0, Math.round(amount)) };
}

export async function awardSkillXp(skillId: string, amount: number) {
  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) return null;
  const xp = (skill.xp || 0) + Math.max(0, Math.round(amount));
  const masteryLevel = levelFromXp(xp);
  return prisma.skill.update({ where: { id: skillId }, data: { xp, masteryLevel } });
}

const BADGES = [
  { key: "first_progress", title: "اولین قدم", description: "اولین پیشرفت ثبت شد", check: async (userId: string) => (await prisma.goalProgress.count({ where: { userId } })) + (await prisma.skillProgress.count({ where: { userId } })) >= 1 },
  { key: "streak_3", title: "سه روز پیاپی", description: "۳ روز streak", check: async (userId: string) => ((await prisma.user.findUnique({ where: { id: userId } }))?.streakCount || 0) >= 3 },
  { key: "streak_7", title: "یک هفته بی‌وقفه", description: "۷ روز streak", check: async (userId: string) => ((await prisma.user.findUnique({ where: { id: userId } }))?.streakCount || 0) >= 7 },
  { key: "goal_completed_1", title: "شکارچی هدف", description: "اولین هدف تکمیل شد", check: async (userId: string) => await prisma.goal.count({ where: { userId, status: "COMPLETED", isActive: true } }) >= 1 },
  { key: "goal_completed_5", title: "فتح‌کننده", description: "۵ هدف تکمیل شد", check: async (userId: string) => await prisma.goal.count({ where: { userId, status: "COMPLETED", isActive: true } }) >= 5 },
  { key: "skill_linker", title: "معمار مهارت", description: "۳ مهارت به اهداف متصل شد", check: async (userId: string) => {
    const goals = await prisma.goal.findMany({ where: { userId, isActive: true }, select: { id: true } });
    const count = await prisma.goalSkill.count({ where: { goalId: { in: goals.map(g => g.id) } } });
    return count >= 3;
  }},
  { key: "progress_10", title: "در مسیر رشد", description: "۱۰ ثبت پیشرفت", check: async (userId: string) => (await prisma.goalProgress.count({ where: { userId } })) + (await prisma.skillProgress.count({ where: { userId } })) >= 10 },
  { key: "daily_task_1", title: "برنامه‌ریز روزانه", description: "اولین تسک روزانه انجام شد", check: async (userId: string) => await prisma.dailyTask.count({ where: { userId, done: true } }) >= 1 },
];

export async function evaluateBadges(userId: string) {
  const earned: typeof BADGES = [];
  for (const b of BADGES) {
    const exists = await prisma.userBadge.findFirst({ where: { userId, badgeKey: b.key } });
    if (exists) continue;
    if (await b.check(userId)) {
      await prisma.userBadge.create({ data: { userId, badgeKey: b.key, title: b.title, description: b.description } });
      earned.push(b);
    }
  }
  return earned;
}

const dailyTemplates = [
  { key: "daily_progress", title: "ثبت یک پیشرفت", description: "امروز حداقل یک پیشرفت هدف یا مهارت ثبت کن", target: 1, xpReward: 20 },
  { key: "daily_task", title: "انجام یک تسک روزانه", description: "یک تسک از لیست امروز را انجام کن", target: 1, xpReward: 15 },
  { key: "daily_focus", title: "تمرکز روی هدف", description: "یک هدف را بررسی یا آپدیت کن", target: 1, xpReward: 15 },
];

const weeklyTemplates = [
  { key: "weekly_progress_5", title: "۵ ثبت پیشرفت", description: "در این هفته ۵ پیشرفت ثبت کن", target: 5, xpReward: 60 },
  { key: "weekly_streak_3", title: "۳ روز فعال", description: "در این هفته حداقل ۳ روز فعال باش", target: 3, xpReward: 50 },
  { key: "weekly_goal_review", title: "بازبینی اهداف", description: "حداقل ۲ هدف را بررسی/آپدیت کن", target: 2, xpReward: 40 },
];

export async function ensureQuests(userId: string) {
  const dk = todayKey();
  const wk = weekKey();
  for (const t of dailyTemplates) {
    const exists = await prisma.userQuest.findFirst({ where: { userId, questKey: t.key, type: "DAILY", periodKey: dk } });
    if (!exists) await prisma.userQuest.create({ data: { userId, questKey: t.key, type: "DAILY", periodKey: dk, title: t.title, description: t.description, target: t.target, xpReward: t.xpReward } });
  }
  for (const t of weeklyTemplates) {
    const exists = await prisma.userQuest.findFirst({ where: { userId, questKey: t.key, type: "WEEKLY", periodKey: wk } });
    if (!exists) await prisma.userQuest.create({ data: { userId, questKey: t.key, type: "WEEKLY", periodKey: wk, title: t.title, description: t.description, target: t.target, xpReward: t.xpReward } });
  }
}

export async function bumpQuest(userId: string, questKey: string, type: "DAILY" | "WEEKLY", amount = 1) {
  const periodKey = type === "DAILY" ? todayKey() : weekKey();
  const q = await prisma.userQuest.findFirst({ where: { userId, questKey, type, periodKey } });
  if (!q || q.status !== "ACTIVE") return null;
  const progress = Math.min(q.target, q.progress + amount);
  const completed = progress >= q.target;
  const updated = await prisma.userQuest.update({ where: { id: q.id }, data: { progress, status: completed ? "COMPLETED" : "ACTIVE", completedAt: completed ? new Date() : null } });
  if (completed) await awardUserXp(userId, q.xpReward);
  return updated;
}

export async function recordProgressEvent(userId: string, opts: { kind: "goal" | "skill"; rating: number; skillId?: string; goalCompleted?: boolean }) {
  await ensureQuests(userId);
  const streak = await updateStreak(userId);
  const base = 10 + opts.rating * 2;
  let gained = base + streak.streakBonus;
  await awardUserXp(userId, gained);
  if (opts.kind === "skill" && opts.skillId) await awardSkillXp(opts.skillId, base);
  if (opts.goalCompleted) await awardUserXp(userId, 100);
  await bumpQuest(userId, "daily_progress", "DAILY", 1);
  await bumpQuest(userId, "weekly_progress_5", "WEEKLY", 1);
  if (streak.streak >= 3) await bumpQuest(userId, "weekly_streak_3", "WEEKLY", 0); // handled by state; we'll sync separately
  const badges = await evaluateBadges(userId);
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { xp: true, level: true, streakCount: true } });
  return { gained, streak: streak.streak, xp: user?.xp || 0, level: user?.level || 1, badges };
}

export async function syncWeeklyStreakQuest(userId: string) {
  await ensureQuests(userId);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;
  const wk = weekKey();
  // approximate: set progress to min(target, active days this week) is hard without log; use streakCount as proxy capped
  const q = await prisma.userQuest.findFirst({ where: { userId, questKey: "weekly_streak_3", type: "WEEKLY", periodKey: wk } });
  if (q && q.status === "ACTIVE") {
    const progress = Math.min(q.target, Math.max(q.progress, Math.min(user.streakCount, 7)));
    const completed = progress >= q.target;
    await prisma.userQuest.update({ where: { id: q.id }, data: { progress, status: completed ? "COMPLETED" : "ACTIVE", completedAt: completed ? new Date() : null } });
    if (completed) await awardUserXp(userId, q.xpReward);
  }
}
