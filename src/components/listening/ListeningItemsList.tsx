import { ListeningItemRow } from "./ListeningItemRow";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/services/types";
import type { ListeningItem } from "@/types/listening";
import { Loader2 } from "lucide-react";
import type { LevelFilter } from "./LevelFilterChips";

interface ListeningItemsListProps {
  items: ListeningItem[];
  pagination?: PaginationMeta;
  page: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  isFetching?: boolean;
  isError: boolean;
  hasActiveFilter?: boolean;
  search?: string;
  levelFilter?: LevelFilter;
}

export function ListeningItemsList({
  items,
  pagination,
  page,
  onPageChange,
  isLoading,
  isFetching = false,
  isError,
  hasActiveFilter = false,
  search = "",
  levelFilter,
}: ListeningItemsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-sm text-[#8B949E]">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading listening items…
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-8 text-center text-sm text-red-400">
        Unable to load list, please try again later.
      </p>
    );
  }

  if (items.length === 0) {
    if (hasActiveFilter) {
      const parts: string[] = [];
      if (search) parts.push(`"${search}"`);
      if (levelFilter && levelFilter !== "All") parts.push(levelFilter);
      const filterDescription =
        parts.length > 0 ? ` for ${parts.join(" · ")}` : "";
      return (
        <p className="py-8 text-center text-sm text-[#8B949E]">
          No listening items found{filterDescription}.
        </p>
      );
    }
    return (
      <p className="py-8 text-center text-sm text-[#8B949E]">
        You haven&apos;t uploaded any listening materials yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "space-y-1 transition-opacity duration-200",
          isFetching && "opacity-60",
        )}
      >
        {items.map((item) => (
          <ListeningItemRow key={item.id} item={item} />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
