import { useEffect, useRef } from "react";

interface WaveformLiveProps {
  analyserNode: AnalyserNode | null;
  isActive: boolean;
  color?: string;
  height?: number;
  className?: string;
}

export function WaveformLive({
  analyserNode,
  isActive,
  color = "#e24b4a",
  height = 40,
  className,
}: WaveformLiveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserNode || !isActive) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      analyserNode.getByteFrequencyData(dataArray);

      const { width, height: h } = canvas;
      ctx.clearRect(0, 0, width, h);

      const barCount = 40;
      const step = Math.floor(bufferLength / barCount);
      const barW = width / barCount;
      const gap = Math.max(1, barW * 0.25);

      ctx.fillStyle = color;

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step] / 255;
        const barH = Math.max(2, value * h * 0.9);
        const x = i * barW + gap / 2;
        const y = (h - barH) / 2;
        ctx.beginPath();
        ctx.roundRect?.(x, y, barW - gap, barH, 2) ??
          ctx.rect(x, y, barW - gap, barH);
        ctx.fill();
      }
    };

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [analyserNode, isActive, color]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={height}
      className={className}
      style={{ width: "100%", height, display: "block", borderRadius: 6 }}
    />
  );
}
