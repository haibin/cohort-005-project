import { useState } from "react";
import { Link, useFetcher } from "react-router";
import { Lock, NotebookPen } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { cn, formatRelativeTime } from "~/lib/utils";
import { describeDraft, type NoteDraft } from "~/modules/lesson-notes";

export type SavedNote = { body: string; updatedAt: string } | null;

// Laid out like the Questions & Discussion card further down the page, so the
// two read as one family: same padding, heading, editor and footer.
export function LessonNote({ note }: { note: SavedNote }) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const [body, setBody] = useState(note?.body ?? "");
  const draft = describeDraft(body, note?.body ?? null);
  const isSaving = fetcher.state !== "idle";
  const error = fetcher.data?.error;

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <NoteHeader />

        <fetcher.Form method="post" className="space-y-2">
          <input type="hidden" name="intent" value="save-note" />
          <Textarea
            name="body"
            rows={5}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="What do you want to remember from this lesson?"
            aria-label="Your notes"
            className="resize-y"
          />
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              size="sm"
              disabled={isSaving || !draft.canSave}
            >
              {isSaving ? "Saving..." : "Save note"}
            </Button>
            <NoteStatus draft={draft} note={note} error={error} />
            <NoteCounter draft={draft} />
          </div>
        </fetcher.Form>
      </CardContent>
    </Card>
  );
}

function NoteStatus({
  draft,
  note,
  error,
}: {
  draft: NoteDraft;
  note: SavedNote;
  error: string | undefined;
}) {
  if (draft.status === "too-long") {
    return (
      <span className="text-sm text-destructive">
        Too long to save. Trim it to {draft.maxLength} characters.
      </span>
    );
  }
  if (draft.status === "unsaved") {
    // A rejected save leaves the draft unsaved, so the server's reason has to
    // win over "Unsaved changes" or the Student never sees why it failed.
    if (error) return <span className="text-sm text-destructive">{error}</span>;
    return (
      <span className="text-xs text-muted-foreground">Unsaved changes</span>
    );
  }
  if (draft.status === "saved" && note) {
    return (
      <span suppressHydrationWarning className="text-xs text-muted-foreground">
        Saved · edited {formatRelativeTime(note.updatedAt)}
      </span>
    );
  }
  return null;
}

function NoteHeader() {
  return (
    <>
      <div className="mb-1 flex items-center gap-2">
        <NotebookPen className="size-5 text-primary" />
        <h2 className="text-xl font-semibold">Your notes</h2>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          <Lock className="size-3" />
          Private
        </span>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Only you can read these. Find them again on your{" "}
        <Link to="/saved" className="underline underline-offset-2">
          Saved
        </Link>{" "}
        page.
      </p>
    </>
  );
}

function NoteCounter({ draft }: { draft: NoteDraft }) {
  return (
    <span
      className={cn(
        "ml-auto text-xs tabular-nums",
        draft.status === "too-long"
          ? "text-destructive"
          : "text-muted-foreground"
      )}
    >
      {draft.length} / {draft.maxLength}
    </span>
  );
}
