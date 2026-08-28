import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, BellDot, Edit, Trash2, LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { CommonTable, type Column } from "../ui/commonTable";
import FilterVocabulary, {
  type VocabularyFilter,
  type SortMode,
} from "./FilterVocabulary";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VocabularyForm from "./VocabularyForm";

import { useVocabularies, useDeleteVocabulary } from "@/hooks/useVocabulary";
import type { Vocabulary as VocabularyType } from "@/services/vocabularyApi";

export default function Vocabulary() {
  const [searchParams, setSearchParams] = useSearchParams();
  // Derive filter from URL so the active tab survives page reload
  const filter = (searchParams.get("status") || "all") as VocabularyFilter;
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVocabulary, setEditingVocabulary] = useState<
    VocabularyType | undefined
  >();

  const deleteMutation = useDeleteVocabulary();

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const keyword = searchParams.get("keyword") || undefined;
  const level = searchParams.get("level") || undefined;
  const partOfSpeech = searchParams.get("partOfSpeech") || undefined;
  const tag = searchParams.get("tag") || undefined;

  const queryParams = useMemo(() => {
    return {
      page,
      limit,
      keyword,
      level,
      partOfSpeech,
      tag,
      status: filter !== "all" ? filter : undefined,
      sort: sortMode === "alphabetical" ? "word" : "created_at",
      order: sortMode === "recent" ? ("desc" as const) : ("asc" as const),
    };
  }, [page, limit, keyword, level, partOfSpeech, tag, filter, sortMode]);

  const { data, isLoading } = useVocabularies(queryParams);

  const handleFilterChange = (newFilter: VocabularyFilter) => {
    setSearchParams((prev) => {
      if (newFilter !== "all") {
        prev.set("status", newFilter);
      } else {
        prev.delete("status");
      }
      prev.set("page", "1");
      return prev;
    });
  };

  const applyParam = (key: string, value?: string) => {
    setSearchParams((prev) => {
      if (!value || !value.trim()) {
        prev.delete(key);
      } else {
        prev.set(key, value.trim());
      }
      prev.set("page", "1");
      return prev;
    });
  };

  const handleResetFilters = () => {
    setSortMode("recent");
    setSearchParams((prev) => {
      prev.delete("keyword");
      prev.delete("level");
      prev.delete("partOfSpeech");
      prev.delete("tag");
      prev.delete("status");
      prev.set("page", "1");
      return prev;
    });
  };

  const handleOpenCreate = () => {
    setEditingVocabulary(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (vocab: VocabularyType) => {
    setEditingVocabulary(vocab);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this vocabulary?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns: Column<VocabularyType>[] = [
    {
      key: "word",
      title: "Word",
      render: (_, record) => (
        <div>
          <div className="font-semibold text-foreground">
            <Link to={`/vocabulary/${record.id}`} className="hover:underline">
              {record.word}
            </Link>
          </div>
          {record.ipa && (
            <div className="text-sm text-muted-foreground">{record.ipa}</div>
          )}
        </div>
      ),
    },
    {
      key: "meaning",
      title: "Meaning",
      render: (_, record) => (
        <div className="text-foreground">
          {record.meaning}
          {record.part_of_speech && (
            <span className="ml-2 text-xs text-muted-foreground italic">
              ({record.part_of_speech})
            </span>
          )}
        </div>
      ),
    },
    {
      key: "level",
      title: "Level",
      render: (level) =>
        level ? (
          <span className="uppercase text-xs text-blue-700 font-medium px-2 py-1 bg-blue-100 rounded-full">
            {level}
          </span>
        ) : (
          "-"
        ),
    },
    {
      key: "tags",
      title: "Tags",
      render: (tags: string[] | undefined) =>
        tags && tags.length > 0 ? (
          <div className="flex gap-1 flex-wrap">
            {tags.map((t) => {
              if (t.startsWith("listening:")) {
                const id = t.split(":")[1];
                return (
                  <Link
                    key={t}
                    to={`/listening/${id}`}
                    className="flex items-center gap-1 text-xs px-2 py-0.5 bg-tertiary text-accent rounded hover:bg-blue-200 transition-colors duration-300 inline-block"
                  >
                    <span className="flex items-center gap-1">
                      {" "}
                      <LinkIcon size={16} />
                      listening
                    </span>
                  </Link>
                );
              }
              return (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded inline-block"
                >
                  {t}
                </span>
              );
            })}
          </div>
        ) : (
          "-"
        ),
    },
    {
      key: "id",
      title: "Actions",
      className: "w-24 text-right",
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenEdit(record)}
            title="Edit"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(record.id)}
            title="Delete"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-w-72  mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between justify-start gap-4">
        <FilterVocabulary
          activeFilter={filter}
          onFilterChange={handleFilterChange}
          sortMode={sortMode}
          onToggleSort={() =>
            setSortMode((m) => (m === "recent" ? "alphabetical" : "recent"))
          }
          searchKeyword={keyword}
          onSearchChange={(kw) => {
            setSearchParams((prev) => {
              if (kw) {
                prev.set("keyword", kw);
              } else {
                prev.delete("keyword");
              }
              prev.set("page", "1");
              return prev;
            });
          }}
          level={level}
          partOfSpeech={partOfSpeech}
          tag={tag}
          onLevelChange={(value) => applyParam("level", value)}
          onPartOfSpeechChange={(value) => applyParam("partOfSpeech", value)}
          onTagChange={(value) => applyParam("tag", value)}
          onReset={handleResetFilters}
        />
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Word
        </Button>
      </div>

      <CommonTable
        data={data?.data || []}
        columns={columns}
        total={data?.pagination?.total || 0}
        isLoading={isLoading}
        emptyIcon={<BellDot />}
        emptyString="No vocabulary found."
        emptySearchString="No results match your search."
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingVocabulary ? "Edit Vocabulary" : "Add Vocabulary"}
            </DialogTitle>
          </DialogHeader>
          <VocabularyForm
            initialData={editingVocabulary}
            onSuccess={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
