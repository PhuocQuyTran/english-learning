import type { ReactNode } from "react";
import { StatCard } from "./StatCard";

export interface HubStat {
  title: string;
  value: string | number;
  caption?: string;
  icon?: ReactNode;
}

export function ReviewHubStats({ stats }: { stats: HubStat[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          caption={stat.caption}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
