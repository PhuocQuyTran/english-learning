import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/utils/duration";

import type { ListeningItem } from "@/types/listening";
import { AudioLines, Clock, ChevronRight } from "lucide-react";

export function ListeningItemRow({ item }: { item: ListeningItem }) {
  const [resolvedDuration, setResolvedDuration] = useState<number | null>(
    item.durationSeconds ?? null,
  );

  useEffect(() => {
    if (typeof item.durationSeconds === "number" && item.durationSeconds > 0) {
      setResolvedDuration(item.durationSeconds);
      return;
    }

    if (!item.mediaUrl) {
      setResolvedDuration(null);
      return;
    }

    let isMounted = true;
    const element = document.createElement(
      item.mediaType === "video" ? "video" : "audio",
    );
    element.preload = "metadata";
    element.src = item.mediaUrl;

    const onLoaded = () => {
      if (!isMounted || !Number.isFinite(element.duration)) {
        return;
      }
      setResolvedDuration(Math.round(element.duration));
    };

    const onError = () => {
      if (isMounted) setResolvedDuration(null);
    };

    element.addEventListener("loadedmetadata", onLoaded);
    element.addEventListener("error", onError);

    return () => {
      isMounted = false;
      element.pause();
      element.removeAttribute("src");
      element.load();
      element.removeEventListener("loadedmetadata", onLoaded);
      element.removeEventListener("error", onError);
    };
  }, [item.durationSeconds, item.mediaType, item.mediaUrl]);

  return (
    <Link
      to={`/listening/${item.id}`}
      className="group relative flex items-center gap-4 rounded-xl border border-white/5 bg-accent py-2 px-3.5 transition-all duration-200 hover:border-white/10 hover:bg-white/5 hover:shadow-lg hover:shadow-black/20"
    >
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-transform duration-200 group-hover:scale-105",
        )}
      >
        <AudioLines className="h-5 w-5 opacity-90 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-base font-medium text-[#E6EDF3] transition-colors group-hover:text-white">
          {item.title}
        </p>
        <div className="flex items-center gap-2 text-xs text-[#8B949E]">
          <span className="inline-flex items-center rounded-md bg-[#3FB950]/10 px-2 py-0.5 font-semibold text-[#3FB950]">
            {item.level}
          </span>
          {item.mediaType && (
            <>
              <span>•</span>
              <span className="capitalize">{item.mediaType}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 pl-2">
        {resolvedDuration ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8B949E]">
            <Clock className="h-3.5 w-3.5" />
            {formatDuration(resolvedDuration)}
          </span>
        ) : null}

        <ChevronRight className="h-4 w-4 text-[#8B949E] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
      </div>
    </Link>
  );
}
