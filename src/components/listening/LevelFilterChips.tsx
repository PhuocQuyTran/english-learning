import { cn } from "@/lib/utils";
import { LEVELS } from "@/constants";
import { Button } from "../ui/button";

export type LevelFilter = string;

interface LevelFilterChipsProps {
  value: LevelFilter;
  onChange: (level: LevelFilter) => void;
  levels?: readonly string[] | string[];
}

export function LevelFilterChips({
  value,
  onChange,
  levels = LEVELS,
}: LevelFilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {levels.map((lvl) => {
        const isActive = value === lvl;
        return (
          <Button
            key={lvl}
            type="button"
            onClick={() => onChange(lvl)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-all duration-150",
              isActive
                ? "bg-[#3FB950] text-[#0D1117] shadow-[0_0_8px_rgba(63,185,80,0.5)]"
                : "border border-white/15 bg-white/5 text-[#8B949E] hover:border-[#3FB950]/40 hover:text-[#E6EDF3]",
            )}
          >
            {lvl}
          </Button>
        );
      })}
    </div>
  );
}
