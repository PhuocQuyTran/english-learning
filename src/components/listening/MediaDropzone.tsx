import type {
  HTMLAttributes,
  InputHTMLAttributes,
  SyntheticEvent,
} from "react";
import { UploadDropzone } from "@/components/ui/upload";
import { MediaPreview } from "./MediaPreview";
import type { UploadStatus } from "@/types/listening";

interface MediaDropzoneProps {
  getRootProps: () => HTMLAttributes<HTMLDivElement>;
  getInputProps: () => InputHTMLAttributes<HTMLInputElement>;
  isDragActive: boolean;
  fileName: string;
  status: UploadStatus;
  duration?: number | null;
  isReadingDuration?: boolean;
  mediaUrl?: string;
  thumbnailUrl?: string;
  uploadProgress: number;
  onTimeUpdate?: (event: SyntheticEvent<HTMLVideoElement>) => void;
  onPlay?: () => void;
}

export function MediaDropzone({
  getRootProps,
  getInputProps,
  isDragActive,
  fileName,
  status,
  duration,
  isReadingDuration,
  mediaUrl,
  thumbnailUrl,
  uploadProgress,
  onTimeUpdate,
  onPlay,
}: MediaDropzoneProps) {
  return (
    <div className="space-y-4">
      <UploadDropzone
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
      />

      <MediaPreview
        fileName={fileName}
        status={status}
        duration={duration}
        isReadingDuration={isReadingDuration}
        mediaUrl={mediaUrl}
        thumbnailUrl={thumbnailUrl}
        uploadProgress={uploadProgress}
        onTimeUpdate={onTimeUpdate}
        onPlay={onPlay}
      />
    </div>
  );
}
