import { Flame } from "lucide-react";
import { useDashboardOverview } from "@/hooks/useDashboardOverview";
import { motion, type HTMLMotionProps } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function StreakWidget() {
  const { data: dashboard, isLoading } = useDashboardOverview();

  if (isLoading || !dashboard) {
    return (
      <div className="flex h-7 items-center justify-center rounded-md bg-muted px-2 opacity-50">
        <Flame className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  const { streak, longestStreak, isActiveToday, recentActivity } = dashboard;
  let level = 0;
  if (streak >= 30) level = 5;
  else if (streak >= 15) level = 4;
  else if (streak >= 8) level = 3;
  else if (streak >= 4) level = 2;
  else if (streak >= 1) level = 1;

  const flameColor =
    level === 0
      ? "text-muted-foreground"
      : level === 1
        ? "text-orange-400"
        : level === 2
          ? "text-orange-500"
          : level === 3
            ? "text-orange-600 drop-shadow-[0_0_8px_rgba(234,88,12,0.5)]"
            : level === 4
              ? "text-orange-600 drop-shadow-[0_0_12px_rgba(234,88,12,0.8)]"
              : "text-rose-600 drop-shadow-[0_0_15px_rgba(225,29,72,0.9)]";

  const containerBg =
    level === 0
      ? "bg-muted"
      : isActiveToday
        ? "bg-orange-500/10 border-orange-500/20"
        : "bg-muted border-transparent";

  const animationProps: HTMLMotionProps<"div"> =
    level >= 3
      ? {
          animate: {
            scale: [1, 1.1, 1],
            rotate: [-2, 2, -2],
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }
      : level >= 2
        ? {
            animate: { scale: [1, 1.05, 1] },
            transition: { duration: 2, repeat: Infinity },
          }
        : {};

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-7 cursor-pointer items-center justify-center gap-1.5 rounded-md border px-2.5 transition-colors hover:bg-muted/80",
            containerBg,
          )}
        >
          <motion.div {...animationProps} className={flameColor}>
            <Flame className="h-4 w-4 fill-current" />
          </motion.div>
          <span
            className={cn(
              "text-[12px] font-bold",
              level > 0
                ? "text-orange-600 dark:text-orange-400"
                : "text-muted-foreground",
            )}
          >
            {streak}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-4 text-sm" align="end">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "rounded-full p-2",
                level > 0 ? "bg-orange-500/10" : "bg-muted",
              )}
            >
              <Flame className={cn("h-5 w-5 fill-current", flameColor)} />
            </div>
            <div>
              <p className="font-semibold">{streak} Day Streak</p>
              <p className="text-xs text-muted-foreground">
                Longest: {longestStreak}
              </p>
            </div>
          </div>
        </div>

        {!isActiveToday && (
          <p className="mb-3 text-xs font-medium text-orange-600 dark:text-orange-400">
            Learn today to keep your streak alive!
          </p>
        )}
        {isActiveToday && (
          <p className="mb-3 text-xs font-medium text-green-600 dark:text-green-500">
            You're on fire! You practiced today.
          </p>
        )}

        {recentActivity && recentActivity.length > 0 && (
          <div className="space-y-2 border-t border-border pt-3">
            <p className="text-xs text-muted-foreground">Last 14 days</p>
            <div className="flex gap-1">
              {recentActivity.map((day, idx) => (
                <div
                  key={idx}
                  title={day.date}
                  className={cn(
                    "h-6 flex-1 rounded-sm",
                    day.active ? "bg-orange-500" : "bg-muted",
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
