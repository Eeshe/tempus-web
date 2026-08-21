export interface Duration {
  hours: number;
  minutes: number;
  seconds: number;
  totalMilliseconds: number;
}

export function computeDuration(
  start: Date | string | null | undefined,
  end: Date | string | null | undefined
): Duration | null {
  if (start == null || end == null) return null;

  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  if (Number.isNaN(startMs)) {
    return null;
  }
  if (Number.isNaN(endMs)) {
    return null;
  }

  return durationFromMs(endMs - startMs);
}

export function durationFromMs(totalMilliseconds: number): Duration {
  const ms = Math.max(0, totalMilliseconds);
  const totalSeconds = Math.floor(ms / 1000);

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalMilliseconds: ms,
  };
}

export function formatHHMMSSTime(duration: Duration | null): string {
  if (duration == null) {
    return "";
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(duration.hours)}:${pad(duration.minutes)}:${pad(duration.seconds)}`;

}
