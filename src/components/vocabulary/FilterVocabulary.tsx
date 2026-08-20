import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchSelect } from "@/components/ui/searchSelect";
import { FILTERS, LEVEL_OPTIONS } from "@/constants";
import { AppSelect } from "../ui/appSelect";
import { Button } from "../ui/button";
import { Input } from "../ui/inputs/Input";
export type VocabularyFilter = "all" | "learning" | "review" | "mastered";
export type SortMode = "recent" | "alphabetical";

interface VocabularyFilterTabsProps {
  activeFilter: VocabularyFilter;
  onFilterChange: (filter: VocabularyFilter) => void;
  sortMode: SortMode;
  onToggleSort: () => void;
  searchKeyword?: string;
  onSearchChange?: (keyword: string) => void;
  level?: string;
  partOfSpeech?: string;
  tag?: string;
  onLevelChange?: (value: string) => void;
  onPartOfSpeechChange?: (value: string) => void;
  onTagChange?: (value: string) => void;
  onReset?: () => void;
}

export default function FilterVocabulary({
  activeFilter,
  onFilterChange,
  sortMode,
  onToggleSort,
  searchKeyword,
  onSearchChange,
  level,
  partOfSpeech,
  tag,
  onLevelChange,
  onPartOfSpeechChange,
  onTagChange,
  onReset,
}: VocabularyFilterTabsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1.5">
          {FILTERS.map(({ value, label }) => {
            const isActive = activeFilter === value;
            return (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={isActive ? "default" : "secondary"}
                onClick={() => onFilterChange(value)}
                className={cn(
                  "shrink-0 text-xs font-medium transition-colors",
                  !isActive && "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </Button>
            );
          })}
        </div>
        <div className="w-[260px]">
          <SearchSelect
            value={searchKeyword || ""}
            onChange={(val) => onSearchChange?.(val)}
            options={
              searchKeyword
                ? [{ label: searchKeyword, value: searchKeyword }]
                : []
            }
            placeholder="Search vocabulary..."
            searchPlaceholder="Type word to search..."
          />
        </div>
        <Button
          onClick={onToggleSort}
          variant="ghost"
          title={
            sortMode === "recent"
              ? "Sort: Newest — click to change A-Z"
              : "Sort: A-Z — click to change Newest"
          }
        >
          {sortMode === "alphabetical" ? (
            <ArrowDownAZ size={16} />
          ) : (
            <ArrowUpAZ size={16} />
          )}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <AppSelect
          value={level}
          onChange={onLevelChange}
          options={LEVEL_OPTIONS}
          placeholder="Level"
          className="w-[140px]"
        />

        <Input
          type="text"
          value={partOfSpeech || ""}
          onChange={(event) => onPartOfSpeechChange?.(event.target.value)}
          placeholder="Part of speech"
          className="w-[140px]"
        />

        <Input
          type="text"
          value={tag || ""}
          onChange={(event) => onTagChange?.(event.target.value)}
          placeholder="Tag"
          className="w-[140px]"
        />
        <Button
          variant="secondary"
          type="button"
          onClick={onReset}
          className="h-9 rounded-md border border-border bg-secondary/60 px-3 text-sm text-muted-foreground hover:text-foreground"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
