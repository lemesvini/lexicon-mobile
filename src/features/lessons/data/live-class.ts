import type { ClassRecord } from "@/features/lessons/types/class-record";
import type { LessonPlanRecord } from "@/features/lessons/types/lesson-plan-record";
import type { LiveClass } from "@/features/lessons/types/live-class";

/** The live class from where the student stands — the path's rule: being at
 *  any class of the lesson beats being absent from one, and an absence counts
 *  only until they have been at one since.
 *
 *  `classes` must be the group's classes of the lesson, newest first. */
export function liveClassOf(
  classes: readonly ClassRecord[],
  plan: Pick<LessonPlanRecord, "scheduled_on" | "starts_at"> | undefined,
): LiveClass {
  const attended = classes.find((entry) => entry.present);
  if (attended) return { status: "attended", day: attended.class_date };

  const missed = classes.find((entry) => entry.present === false);
  if (missed) return { status: "missed", day: missed.class_date };

  const taught = classes.find((entry) => entry.held);
  if (taught) return { status: "taught", day: taught.class_date };

  return plan?.scheduled_on
    ? { status: "scheduled", day: plan.scheduled_on, startsAt: plan.starts_at?.slice(0, 5) ?? null }
    : { status: "unscheduled" };
}
