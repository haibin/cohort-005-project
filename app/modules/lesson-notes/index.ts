import { describeDraft as describe, type NoteDraft } from "./lib/draft";

export type { NoteDraft, NoteDraftStatus } from "./lib/draft";

/**
 * What the Lesson note editor should show for the text in the box: the
 * character count against the limit, whether the draft is saved, and whether
 * Save can be pressed. `savedBody` is the stored Note, or null when the
 * Student has not written one.
 */
export function describeDraft(
  draft: string,
  savedBody: string | null
): NoteDraft {
  return describe(draft, savedBody);
}
