import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type HTMLAttributes,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  uploadMedia,
  createAudioItem,
  generateTranscript,
} from "@/services/listeningApi";

import { MAX_FILE_SIZE_BYTES } from "@/constants";
import {
  UPLOAD_STATUS,
  type UploadStatus,
  type ListeningLevel,
} from "@/types/listening";
import {
  LISTENING_ITEMS_QUERY_KEY,
  TEXT_SIZE_FILE,
} from "@/constants/listeningQueryKeys";
import { readMediaDuration } from "@/utils/mediaDuration";

interface UseMediaUploadOptions {
  onUploaded?: (result: { id: string }) => void;
}

export interface UploadPayload {
  title: string;
  level?: ListeningLevel;
  category?: string;
  description?: string;
  durationSeconds?: number;
}

export function useMediaUpload(options?: UseMediaUploadOptions) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("No file selected");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<UploadStatus>(UPLOAD_STATUS.idle);
  const [duration, setDuration] = useState<number | null>(null);
  const [isReadingDuration, setIsReadingDuration] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const uploadMutation = useMutation<{ id: string }, Error, UploadPayload>({
    mutationFn: async (payload) => {
      if (!file) throw new Error("Please select a file first");

      setStatus(UPLOAD_STATUS.uploading);
      const item = await createAudioItem(
        payload.title,
        payload.level,
        payload.category,
        payload.description,
        payload.durationSeconds ?? undefined,
      );

      await uploadMedia(item.id, file, (percent) => setUploadProgress(percent));

      setStatus(UPLOAD_STATUS.transcribing);
      await generateTranscript(item.id);

      return { id: item.id };
    },
    onSuccess: () => {
      setStatus(UPLOAD_STATUS.ready);
      toast.success("Upload and create translation successfully");
      queryClient.invalidateQueries({ queryKey: [LISTENING_ITEMS_QUERY_KEY] });
    },
    onError: (error) => {
      setStatus(UPLOAD_STATUS.error);
      console.error(error);
      toast.error(error.message || "Upload failed, please try again");
    },
    onSettled: () => setUploadProgress(0),
  });

  const processFile = (pickedFile?: File) => {
    if (!pickedFile) return;

    if (pickedFile.size > MAX_FILE_SIZE_BYTES) {
      toast.error(TEXT_SIZE_FILE);
      return;
    }

    const isValidType =
      pickedFile.type.startsWith("audio/") ||
      pickedFile.type.startsWith("video/");

    if (!isValidType) {
      toast.error("File format not supported, only audio/video is received");
      return;
    }

    setFile(pickedFile);
    setFileName(pickedFile.name);
    setStatus(UPLOAD_STATUS.idle);
    setDuration(null);

    setIsReadingDuration(true);
    readMediaDuration(pickedFile)
      .then((seconds) => setDuration(seconds))
      .catch((error) => {
        console.warn("Không đọc được thời lượng file:", error);
        setDuration(null);
      })
      .finally(() => setIsReadingDuration(false));
  };
  const getInputProps = (): React.ComponentPropsWithRef<"input"> => ({
    ref: inputRef,
    type: "file",
    accept: "audio/*,video/*",
    multiple: false,
    disabled: uploadMutation.isPending,
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      const picked = event.target.files?.[0];
      processFile(picked);
      event.target.value = "";
    },
  });

  const getRootProps = (): HTMLAttributes<HTMLDivElement> => ({
    onClick: () => {
      if (!uploadMutation.isPending) inputRef.current?.click();
    },
    onDragOver: (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    onDragEnter: (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragActive(true);
    },
    onDragLeave: (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragActive(false);
    },
    onDrop: (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragActive(false);
      const picked = event.dataTransfer.files?.[0];
      processFile(picked);
    },
  });

  const confirmUpload = () => {
    if (uploadMutation.data) {
      options?.onUploaded?.(uploadMutation.data);
    }
  };
  return {
    file,
    inputRef,
    duration,
    isReadingDuration,
    getRootProps,
    getInputProps,
    processFile,
    isDragActive,
    fileName,
    status,
    uploadProgress,
    isUploading:
      status === UPLOAD_STATUS.uploading ||
      status === UPLOAD_STATUS.transcribing,
    mediaUrl: file ? URL.createObjectURL(file) : undefined,
    remoteMedia: uploadMutation.data,
    uploadError: uploadMutation.error,
    upload: uploadMutation.mutate,
    isPending: uploadMutation.isPending,
    confirmUpload,
  };
}
