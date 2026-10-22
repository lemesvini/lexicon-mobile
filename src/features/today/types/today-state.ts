import type { TodayData } from "@/features/today/types/today-data";

export type TodayState =
  | { status: "loading" }
  | { status: "ready"; data: TodayData }
  | { status: "error"; message: string };
