import type { Skill } from "@/features/practice/types/skill";

export type SkillPractice = {
  skill: Skill;
  /** What's in it, e.g. "Diálogos da Lesson Eight". */
  subtitle: string;
  /** Top-right of the card: how long it takes ("4 min") or how far along ("1 de 5"). */
  meta: string;
};
