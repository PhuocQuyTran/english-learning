import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notesEndpoints } from "@/services/endpoints";
import { api } from "@/api/axios";
import type { PaginatedApiResponse, ApiResponse } from "@/services/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, Edit2, Check, X } from "lucide-react";
import toast from "react-hot-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updated_at: string;
}

export function NotesTab({ audioItemId }: { audioItemId: string }) {
  const queryClient = useQueryClient();
  const tag = `listening:${audioItemId}`;
  const queryKey = ["notes", { tag }];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get<PaginatedApiResponse<Note>>(
        notesEndpoints.list,
        {
          params: { tag, limit: 100 },
        },
      );
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: {
      title: string;
      content: string;
      tags: string[];
    }) => {
      const res = await api.post<ApiResponse<Note>>(
        notesEndpoints.create,
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Note saved");
      setNewNoteTitle("");
      setNewNoteContent("");
      setIsAdding(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(notesEndpoints.remove(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Note deleted");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: {
      id: string;
      title?: string;
      content?: string;
    }) => {
      const res = await api.patch<ApiResponse<Note>>(
        notesEndpoints.update(id),
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Note updated");
      setEditingId(null);
    },
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleSave = () => {
    if (!newNoteTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    createMutation.mutate({
      title: newNoteTitle,
      content: newNoteContent,
      tags: [tag],
    });
  };

  const handleUpdate = () => {
    if (!editTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    updateMutation.mutate({
      id: editingId!,
      title: editTitle,
      content: editContent,
    });
  };

  const notes = data?.data || [];

  return (
    <div className="rounded-xl border border-white/10 bg-[#161B22] p-4 text-[#C9D1D9]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#E6EDF3]">Notes</h2>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="sm" variant="success">
            + New Note
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="mb-6 rounded-lg border border-[#3FB950]/30 bg-[#3FB950]/5 p-4">
          <Input
            placeholder="Note title..."
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            className="mb-2 bg-[#0D1117] border-white/10 text-sm"
          />
          <Textarea
            placeholder="Write your note here..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="mb-3 min-h-[80px] bg-[#0D1117] border-white/10 text-sm resize-y"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={createMutation.isPending}
              className="bg-[#238636] hover:bg-[#2EA043]"
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-[#8B949E]" />
        </div>
      ) : notes.length === 0 && !isAdding ? (
        <div className="text-center py-8 text-[#8B949E] text-sm border border-dashed border-white/10 rounded-lg">
          No notes yet for this item.
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg border border-white/10 bg-[#0D1117] p-4 group"
            >
              {editingId === note.id ? (
                <div>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="mb-2 bg-[#161B22] border-white/10 text-sm h-8 font-semibold"
                  />
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="mb-3 min-h-[60px] bg-[#161B22] border-white/10 text-sm p-2"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 px-2 bg-[#238636]"
                      onClick={handleUpdate}
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" /> Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm text-[#E6EDF3]">
                      {note.title}
                    </h3>
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 mr-1 hover:bg-white/10"
                        onClick={() => {
                          setEditTitle(note.title);
                          setEditContent(note.content || "");
                          setEditingId(note.id);
                        }}
                      >
                        <Edit2 className="h-3.5 w-3.5 text-[#8B949E]" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-red-500/20 hover:text-red-400"
                        onClick={() => {
                          if (confirm("Delete this note?"))
                            deleteMutation.mutate(note.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-[#8B949E]" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-wrap text-[#C9D1D9]">
                    {note.content}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
