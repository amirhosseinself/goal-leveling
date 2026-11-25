import { GoalCategory, GoalPriority, GoalStatus, SkillLevel, SkillLearningStatus } from "@prisma/client";

// دیکشنری ترجمه برای GoalCategory
export const GoalCategoryTranslations: Record<GoalCategory, string> = {
  [GoalCategory.SHORT_TERM]: "اهداف کوتاه‌مدت",
  [GoalCategory.LONG_TERM]: "اهداف بلندمدت",
  [GoalCategory.FITNESS]: "اهداف مرتبط با ورزش و تناسب اندام",
  [GoalCategory.EDUCATION]: "اهداف تحصیلی و یادگیری",
  [GoalCategory.CAREER]: "اهداف شغلی و حرفه‌ای",
  [GoalCategory.FINANCIAL]: "اهداف مالی و اقتصادی",
  [GoalCategory.PERSONAL]: "اهداف شخصی و توسعه فردی",
  [GoalCategory.RELATIONSHIP]: "اهداف مربوط به روابط اجتماعی و خانوادگی",
  [GoalCategory.OTHER]: "سایر اهداف",
};

// دیکشنری ترجمه برای GoalPriority
export const GoalPriorityTranslations: Record<GoalPriority, string> = {
  [GoalPriority.LOW]: "کم",
  [GoalPriority.MEDIUM]: "متوسط",
  [GoalPriority.HIGH]: "زیاد",
};

// دیکشنری ترجمه برای GoalStatus
export const GoalStatusTranslations: Record<GoalStatus, string> = {
  [GoalStatus.IN_PROGRESS]: "در حال انجام",
  [GoalStatus.COMPLETED]: "تمام شده",
  [GoalStatus.SUSPENDED]: "متوقف شده",
  [GoalStatus.CANCELLED]: "لغو شده",
};

export const SkillLevelTranslations: Record<SkillLevel, string> = {
  [SkillLevel.BEGINNER]: "مبتدی",
  [SkillLevel.INTERMEDIATE]: "متوسط",
  [SkillLevel.ADVANCED]: "پیشرفته",
};

export const SkillLearningStatusTranslations: Record<SkillLearningStatus, string> = {
  [SkillLearningStatus.NOT_STARTED]: "شروع نشده",
  [SkillLearningStatus.IN_PROGRESS]: "در حال یادگیری",
  [SkillLearningStatus.MASTERED]: "تسلط یافته",
};
