import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, AudioLines, Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MediaDropzone } from "@/components/listening/MediaDropzone";
import { LevelFilterChips } from "@/components/listening/LevelFilterChips";
import type { LevelFilter } from "@/components/listening/LevelFilterChips";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { UPLOAD_STATUS } from "@/types/listening";
import { uploadSchema, type UploadFormValues } from "@/scheme/listeningSchema";
import { Input } from "../ui/inputs/Input";
import { LEVEL_VALUES } from "@/constants";

export default function ListeningUploadPage() {
  const navigate = useNavigate();

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      level: undefined,
      file: undefined,
    },
  });

  const {
    file,
    fileName,
    status,
    duration,
    isReadingDuration,
    uploadProgress,
    isDragActive,
    getRootProps,
    getInputProps,
    upload,
    isPending,
    mediaUrl,
    confirmUpload,
  } = useMediaUpload({
    onUploaded: (result) => {
      navigate(`/listening/${result.id}`);
    },
  });

  useEffect(() => {
    if (file) {
      form.setValue("file", file, { shouldValidate: true });
      if (!form.getValues("title")) {
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        form.setValue("title", baseName, { shouldValidate: true });
      }
    } else {
      form.setValue("file", undefined as any, { shouldValidate: false });
    }
  }, [file, form]);

  const isSubmitting =
    isPending ||
    status === UPLOAD_STATUS.uploading ||
    status === UPLOAD_STATUS.transcribing;

  const onSubmit = (values: UploadFormValues) => {
    if (!file) {
      toast.error("Please choose an audio or video file first");
      return;
    }
    upload({
      title: values.title,
      level: values.level,
    });
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 flex w-full justify-between items-center">
        <Link to="/listening">
          <Button variant="ghost">
            <ArrowLeft className="mr-2" /> Back to Listening
          </Button>
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Upload Media</h1>
      </div>

      <Card className="overflow-hidden border-[#3FB950]/20 bg-[#0D1117] text-[#E6EDF3]">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="text-xl">Import audio / video</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#8B949E]">
                      Title <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Daily English Conversation"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#8B949E]">
                      Level <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <LevelFilterChips
                        value={(field.value as LevelFilter) ?? "All"}
                        onChange={(lvl) => {
                          if (lvl !== "All") {
                            field.onChange(lvl);
                          }
                        }}
                        levels={LEVEL_VALUES}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#8B949E]">
                      Media file <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <MediaDropzone
                        getRootProps={getRootProps}
                        getInputProps={getInputProps}
                        isDragActive={isDragActive}
                        fileName={fileName}
                        mediaUrl={mediaUrl}
                        status={status}
                        duration={duration}
                        isReadingDuration={isReadingDuration}
                        uploadProgress={uploadProgress}
                        onTimeUpdate={() => {}}
                        onPlay={confirmUpload}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isSubmitting && (
                <div className="flex items-center gap-2 rounded-xl border border-[#3FB950]/30 bg-[#0D1117] p-3 text-sm text-[#8B949E]">
                  <Loader2 className="h-4 w-4 animate-spin text-[#3FB950]" />
                  {status === UPLOAD_STATUS.uploading
                    ? `Uploading… ${uploadProgress}%`
                    : "Generating transcript…"}
                </div>
              )}

              {status !== UPLOAD_STATUS.ready && (
                <Button
                  type="submit"
                  className="w-full gap-2 bg-[#3FB950] text-[#0D1117] hover:bg-[#3FB950]/90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {status === UPLOAD_STATUS.uploading
                        ? "Uploading…"
                        : "Transcribing…"}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload &amp;
                      <AudioLines className="h-4 w-4" />
                      Generate Transcript
                    </>
                  )}
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
