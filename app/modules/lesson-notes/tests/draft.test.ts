import { describe, it, expect } from "vitest";
import { describeDraft } from "../index";
import { MAX_NOTE_LENGTH } from "~/lib/notes";

describe("describeDraft", () => {
  it("cannot save an empty box", () => {
    expect(describeDraft("", null)).toEqual({
      length: 0,
      maxLength: MAX_NOTE_LENGTH,
      status: "empty",
      canSave: false,
    });
  });

  it("treats whitespace alone as empty, even over a saved note", () => {
    const draft = describeDraft("   \n ", "Generics are templates");
    expect(draft.status).toBe("empty");
    expect(draft.canSave).toBe(false);
  });

  it("can save a new note", () => {
    expect(describeDraft("Types vanish at runtime", null)).toEqual({
      length: 23,
      maxLength: MAX_NOTE_LENGTH,
      status: "unsaved",
      canSave: true,
    });
  });

  it("can save a change to a saved note", () => {
    const draft = describeDraft("Types vanish at compile time", "Types vanish");
    expect(draft.status).toBe("unsaved");
    expect(draft.canSave).toBe(true);
  });

  it("reports a draft that matches the saved note as saved", () => {
    const draft = describeDraft("Types vanish", "Types vanish");
    expect(draft.status).toBe("saved");
    expect(draft.canSave).toBe(false);
  });

  it("ignores surrounding whitespace, as the save does", () => {
    const draft = describeDraft("  Types vanish\n", "Types vanish");
    expect(draft.status).toBe("saved");
    expect(draft.length).toBe(12);
  });

  it("allows a note of exactly the limit", () => {
    const draft = describeDraft("a".repeat(MAX_NOTE_LENGTH), null);
    expect(draft.status).toBe("unsaved");
    expect(draft.canSave).toBe(true);
  });

  it("refuses a note one character over the limit", () => {
    const draft = describeDraft("a".repeat(MAX_NOTE_LENGTH + 1), null);
    expect(draft.status).toBe("too-long");
    expect(draft.length).toBe(MAX_NOTE_LENGTH + 1);
    expect(draft.canSave).toBe(false);
  });

  it("does not count trailing whitespace against the limit", () => {
    const draft = describeDraft(`${"a".repeat(MAX_NOTE_LENGTH)}\n\n`, null);
    expect(draft.status).toBe("unsaved");
  });
});
