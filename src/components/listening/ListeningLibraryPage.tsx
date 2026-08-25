import { useEffect, useState } from "react";
import { Search, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useListeningItems } from "@/hooks/useListeningItems";
import { useDebounce } from "@/hooks/useDebounce";
import { ListeningItemsList } from "@/components/listening/ListeningItemsList";
import { LevelFilterChips } from "@/components/listening/LevelFilterChips";
import type { LevelFilter } from "@/components/listening/LevelFilterChips";
import { Input } from "../ui/inputs/Input";
import type { ListeningLevel } from "@/types/listening";

export default function ListeningLibraryPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<LevelFilter>("All");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search.trim(), 350);
  const normalizedLevel: ListeningLevel | undefined =
    level === "All" ? undefined : (level as ListeningLevel);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, level]);

  const { data, isLoading, isFetching, isError } = useListeningItems({
    search: debouncedSearch || undefined,
    level: normalizedLevel,
    page,
    limit: 10,
  });

  const hasActiveFilter = debouncedSearch.length > 0;

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      <div className="mx-auto w-full px-4 pb-8 pt-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-[#161B22] px-4 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-[#8B949E]" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search audio..."
              className="w-full bg-transparent text-sm text-[#E6EDF3] border-none placeholder:text-[#8B949E] focus:outline-none"
            />
          </div>
          <Link
            to="/listening/upload"
            className="rounded-full p-2 hover:bg-white/5"
            aria-label="Upload new audio"
          >
            <Upload className="h-5 w-5" />
          </Link>
        </div>

        <div className="mb-4">
          <LevelFilterChips value={level} onChange={setLevel} />
        </div>

        <ListeningItemsList
          items={data?.data ?? []}
          pagination={data?.pagination}
          page={page}
          onPageChange={setPage}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          hasActiveFilter={hasActiveFilter}
          search={debouncedSearch}
          levelFilter={level}
        />
      </div>
    </div>
  );
}
