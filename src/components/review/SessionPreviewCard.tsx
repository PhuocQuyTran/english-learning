import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppSelect } from "@/components/ui/appSelect";
import { Input } from "@/components/ui/inputs/Input";
import type { QuickSize } from "@/constants/review";
import type { SessionMode } from "@/constants/review";
import { QUICK_SIZE_OPTIONS, REVIEW_MODE_OPTIONS } from "@/constants/review";
import { LEVEL_OPTIONS } from "@/constants";

interface SessionPreviewCardProps {
  mode: SessionMode;
  onModeChange: (mode: SessionMode) => void;
  quickSize: QuickSize;
  onQuickSizeChange: (size: QuickSize) => void;
  filterLevel?: string;
  onFilterLevelChange: (level: string | undefined) => void;
  filterTag?: string;
  onFilterTagChange: (tag: string | undefined) => void;
  sessionEstimateLabel: string;
  estimatedMinutes: number;
  sessionDescription: string;
  onStart: () => void;
  total: number;
  isSubmitting: boolean;
}

export function SessionPreviewCard({
  mode,
  onModeChange,
  quickSize,
  onQuickSizeChange,
  filterLevel,
  onFilterLevelChange,
  filterTag,
  onFilterTagChange,
  sessionEstimateLabel,
  estimatedMinutes,
  sessionDescription,
  onStart,
  total,
  isSubmitting,
}: SessionPreviewCardProps) {
  return (
    <Card className="border-border bg-background">
      <CardContent className="space-y-4 p-5">
        <div className="text-sm uppercase tracking-wide text-muted-foreground">
          Session preview
        </div>
        <div className="text-xl font-semibold">{sessionEstimateLabel}</div>
        <div className="text-sm text-muted-foreground">
          About {estimatedMinutes} minute{estimatedMinutes > 1 ? "s" : ""}
        </div>
        <p className="text-sm text-muted-foreground">{sessionDescription}</p>

        {/* ── Filter by Level & Tag ─────────────────────────── */}
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Filter cards</div>
          <div className="flex gap-2">
            <AppSelect
              value={filterLevel}
              onChange={(val) => onFilterLevelChange(val || undefined)}
              options={LEVEL_OPTIONS}
              placeholder="All Levels"
              className="flex-1"
            />
            <Input
              type="text"
              value={filterTag ?? ""}
              onChange={(e) => onFilterTagChange(e.target.value || undefined)}
              placeholder="Tag (e.g. listening:...)"
              className="flex-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {REVIEW_MODE_OPTIONS.map(({ value, label }) => (
            <Button
              key={value}
              variant={mode === value ? "default" : "outline"}
              onClick={() => onModeChange(value)}
              className="text-sm"
              disabled={isSubmitting}
            >
              {label}
            </Button>
          ))}
        </div>

        {mode === "quick" && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">How many cards?</div>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_SIZE_OPTIONS.map((size) => (
                <Button
                  key={String(size)}
                  variant={quickSize === size ? "default" : "outline"}
                  onClick={() => onQuickSizeChange(size)}
                  disabled={isSubmitting}
                >
                  {size === "all" ? "All" : size}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Button
          className="w-full"
          onClick={onStart}
          disabled={isSubmitting || total === 0}
        >
          <Play className="mr-2 h-4 w-4" />
          Start Review
        </Button>
      </CardContent>
    </Card>
  );
}
