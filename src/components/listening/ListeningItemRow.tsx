import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/utils/duration";

import type { ListeningItem } from "@/types/listening";
import { AudioLines } from "lucide-react";

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
      className="flex items-center gap-3 rounded-xl transition-colors hover:bg-white/5 bg-accent"
    >
      <div
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-white border",
        )}
      >
        <AudioLines className="h-6 w-6" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-[#E6EDF3]">{item.title}</p>
        <p className="mt-0.5 text-sm text-[#8B949E]">
          <span className="font-medium text-[#3FB950]">{item.level}</span>
        </p>
      </div>

      {resolvedDuration ? (
        <span className="shrink-0 px-4 text-sm text-[#8B949E]">
          {formatDuration(resolvedDuration)}
        </span>
      ) : null}
    </Link>
  );
}
