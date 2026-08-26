import { useMemo } from "react";

interface WaveformStaticProps {
  seed: string;
  barCount?: number;
  color?: string;
  height?: number;
  progress?: number;
  activeColor?: string;
  className?: string;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function strToSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h;
}

export function WaveformStatic({
  seed,
  barCount = 32,
  color = "currentColor",
  activeColor = "#fff",
  height = 24,
  progress,
  className,
}: WaveformStaticProps) {
  const bars = useMemo(() => {
    const rand = mulberry32(strToSeed(seed));
    return Array.from({ length: barCount }, () => 3 + rand() * (height - 6));
  }, [seed, barCount, height]);

  const vw = barCount * 6;
  const bw = vw / barCount;
  const gap = Math.max(1, bw * 0.3);

  return (
    <svg
      viewBox={`0 0 ${vw} ${height}`}
      preserveAspectRatio="none"
      className={className}
      style={{ width: "100%", height, display: "block" }}
      aria-hidden="true"
    >
      {bars.map((h, i) => {
        const x = i * bw + gap / 2;
        const y = (height - h) / 2;
        const isActive = progress !== undefined && i / barCount <= progress;
        return (
          <rect
            key={i}
            x={x.toFixed(1)}
            y={y.toFixed(1)}
            width={Math.max(1, bw - gap).toFixed(1)}
            height={h.toFixed(1)}
            rx="1"
            fill={isActive ? activeColor : color}
            opacity={isActive ? 1 : 0.85}
          />
        );
      })}
    </svg>
  );
}
