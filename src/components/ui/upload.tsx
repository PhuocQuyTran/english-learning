import type { HTMLAttributes, InputHTMLAttributes, RefObject } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  getRootProps: () => HTMLAttributes<HTMLDivElement>;
  getInputProps: () => InputHTMLAttributes<HTMLInputElement>;
  inputRef?: RefObject<HTMLInputElement | null>;
  isDragActive: boolean;
}

export function UploadDropzone({
  getRootProps,
  getInputProps,
  inputRef,
  isDragActive,
}: UploadDropzoneProps) {
  return (
    <div
      {...getRootProps()}
      className={cn(
        "cursor-pointer rounded-2xl border border-dashed p-6 text-center transition-colors",
        isDragActive
          ? "border-[#3FB950] bg-[#3FB950]/10"
          : "border-[#8B949E]/70 bg-[#0D1117] hover:border-[#3FB950]",
      )}
    >
      <input type="file" ref={inputRef} {...getInputProps()} hidden />
      <div className="flex flex-col items-center justify-center gap-3">
        <UploadCloud className="h-8 w-8 text-[#3FB950]" />
        <div>
          <p className="text-base font-medium text-[#E6EDF3]">
            {isDragActive ? "Drop your file here" : "Upload audio or video"}
          </p>
          <p className="mt-1 text-sm text-[#8B949E]">
            MP3, WAV, MP4, webm, as long as it is an audio/video file.
          </p>
        </div>
      </div>
    </div>
  );
}
