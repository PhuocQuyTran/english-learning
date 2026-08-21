import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  caption?: string;
  icon?: ReactNode;
}

export function StatCard({ title, value, caption, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm text-muted-foreground">{title}</div>
            <div className="mt-1 text-2xl font-semibold">{value}</div>
            {caption && (
              <div className="mt-1 text-xs text-muted-foreground">
                {caption}
              </div>
            )}
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
