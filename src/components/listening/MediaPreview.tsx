import type { SyntheticEvent } from "react";
import { FileVideo, Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { UPLOAD_STATUS, type UploadStatus } from "@/types/listening";
import { Button } from "../ui/button";
import { DEFAULT_THUMBNAIL_URL } from "@/constants";
import { STATUS_LABEL } from "@/constants/listeningQueryKeys";
import { formatDuration } from "@/utils/duration";

interface MediaPreviewProps {
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

export function MediaPreview({
  fileName,
  status,
  duration,
  thumbnailUrl,
  uploadProgress,
  onPlay,
}: MediaPreviewProps) {
  if (status === "idle") return null;

  return (
    <div className="rounded-xl border border-white/10 bg-[#161B22] p-4">
      <div className="mb-3 flex items-center justify-between text-sm text-[#8B949E]">
        <span className="truncate">{fileName}</span>

        <span
          className={cn(
            status === UPLOAD_STATUS.error ? "text-red-400" : "text-[#3FB950]",
          )}
        >
          {status === UPLOAD_STATUS.uploading
            ? `${STATUS_LABEL[status]} ${uploadProgress}%`
            : STATUS_LABEL[status]}
        </span>
      </div>

      {status === UPLOAD_STATUS.ready ? (
        <>
          <Button
            variant="outline"
            type="button"
            onClick={onPlay}
            className="group relative flex min-h-36 w-full items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#0D1117]"
          >
            <img
              src={thumbnailUrl || DEFAULT_THUMBNAIL_URL}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-70"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#3FB950] text-[#0D1117] shadow-lg transition-transform group-hover:scale-105">
              <Play className="h-6 w-6 fill-current" />
            </span>

            {duration ? (
              <span className="absolute bottom-2 right-2 rounded bg-accent px-1.5">
                {formatDuration(duration)}
              </span>
            ) : null}
          </Button>
          <p className="text-sm justify-center w-full text-center mx-auto mt-2">
            Please click on the video to continue
          </p>
        </>
      ) : (
        <div className="relative flex min-h-36 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#0D1117]">
          <div className="flex flex-col items-center gap-2 text-[#8B949E]">
            {status === UPLOAD_STATUS.error ? (
              <FileVideo className="h-7 w-7 text-red-400" />
            ) : (
              <Loader2 className="h-7 w-7 animate-spin text-[#3FB950]" />
            )}
            <p className="text-sm">
              {status === UPLOAD_STATUS.error
                ? "Xử lý thất bại, thử lại nhé"
                : STATUS_LABEL[status]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
