import type { ReviewSchedule } from "@/services/reviewApi";

export function normalizePreviewWord(
  vocabulary?: ReviewSchedule["vocabulary"],
) {
  return vocabulary?.word || "Untitled word";
}

export function flashcardBackText(schedule: ReviewSchedule) {
  return {
    meaning: schedule.vocabulary?.meaning || "No meaning available.",
    partOfSpeech: schedule.vocabulary?.part_of_speech,
    example: schedule.vocabulary?.example,
    tags: schedule.vocabulary?.tags ?? [],
  };
}

export function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true']"),
  );
}
export function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}
