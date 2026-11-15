import { MAX_NOTE_LENGTH } from "~/lib/notes";

export type NoteDraftStatus = "empty" | "too-long" | "unsaved" | "saved";

export type NoteDraft = {
  /** Characters the save will keep, which is what the counter shows. */
  length: number;
  maxLength: number;
  status: NoteDraftStatus;
  /** Whether the Save button should accept a click. */
  canSave: boolean;
};

// The save action trims the body before it checks or stores it, so the draft
// is judged trimmed too: a trailing newline is neither a change nor a character
// over the limit. A saved body went through that same trim.
export function describeDraft(
  draft: string,
  savedBody: string | null
): NoteDraft {
  const trimmed = draft.trim();
  const status = draftStatus(trimmed, savedBody);
  return {
    length: trimmed.length,
    maxLength: MAX_NOTE_LENGTH,
    status,
    canSave: status === "unsaved",
  };
}

function draftStatus(trimmed: string, savedBody: string | null) {
  if (trimmed.length === 0) return "empty";
  if (trimmed.length > MAX_NOTE_LENGTH) return "too-long";
  if (trimmed === savedBody) return "saved";
  return "unsaved";
}
