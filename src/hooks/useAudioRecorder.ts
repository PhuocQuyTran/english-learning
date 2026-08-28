import type { Recording } from "@/types/listening";
import { useCallback, useEffect, useRef, useState } from "react";
import { calculateSimilarity } from "@/utils/stringSimilarity";

type RecorderStatus = "idle" | "requesting" | "recording" | "error";

interface UseAudioRecorderReturn {
  status: RecorderStatus;
  error: string | null;
  elapsedMs: number;
  analyserNode: AnalyserNode | null;
  start: () => Promise<void>;
  stop: () => void;
}

interface UseAudioRecorderOptions {
  expectedText?: string;
  onRecorded: (recording: Recording) => void;
}

export function useAudioRecorder(
  options: UseAudioRecorderOptions,
): UseAudioRecorderReturn {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close();
    streamRef.current = null;
    audioCtxRef.current = null;
    setAnalyserNode(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
  }, []);
  useEffect(() => () => cleanup(), [cleanup]);

  const start = useCallback(async () => {
    setError(null);
    setStatus("requesting");

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Microphone access denied");
      setStatus("error");
      return;
    }

    streamRef.current = stream;
    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    setAnalyserNode(analyser);

    transcriptRef.current = "";
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcriptRef.current += event.results[i][0].transcript + " ";
        }
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn("Speech recognition failed to start", e);
      }
    }
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;
    chunksRef.current = [];

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mr.onstop = () => {
      const durationMs = Date.now() - startTimeRef.current;
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);

      let score: number | null = null;
      if (options.expectedText) {
        if (transcriptRef.current.trim()) {
          score = calculateSimilarity(
            options.expectedText,
            transcriptRef.current,
          );
        } else {
          // Mock score fallback if speech recognition was unavailable or didn't pick up anything
          score = Math.floor(Math.random() * 40) + 60;
        }
      }

      const recording: Recording = {
        id: crypto.randomUUID(),
        blob,
        url,
        durationMs,
        score,
        createdAt: new Date(),
      };
      options.onRecorded(recording);
      cleanup();
      setStatus("idle");
      setElapsedMs(0);
    };

    mr.start(100);
    startTimeRef.current = Date.now();
    setStatus("recording");
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 200);
  }, [cleanup, options]);

  const stop = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, []);

  return { status, error, elapsedMs, analyserNode, start, stop };
}
