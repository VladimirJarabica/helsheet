import { describe, test, expect } from "vitest";
import { transposeNote } from "./MusicSheetSelector";
import { Scale } from "@prisma/client";

describe("transposition", () => {
  test("transpose notes", () => {
    expect(
      transposeNote({
        from: Scale.C_dur,
        to: Scale.F_dur,
        note: { note: "c", pitch: 1 },
      })
    ).toEqual({ note: "f", pitch: 1 });

    expect(
      transposeNote({
        from: Scale.G_dur,
        to: Scale.F_dur,
        note: { note: "fis", pitch: 2 },
      })
    ).toEqual({ note: "e", pitch: 2 });
  });

  test("transpose notes from different pitch", () => {
    expect(
      transposeNote({
        from: Scale.C_dur,
        to: Scale.Es_dur,
        note: { note: "h", pitch: 0 },
      })
    ).toEqual({ note: "d", pitch: 1 });
  });

  test("applied pitch difference", () => {
    expect(
      transposeNote({
        from: Scale.C_dur,
        to: Scale.F_dur,
        note: { note: "c", pitch: 1 },
        pitchOffset: 3,
      })
    ).toEqual({ note: "f", pitch: 4 });

    expect(
      transposeNote({
        from: Scale.Es_dur,
        to: Scale.C_dur,
        note: { note: "d", pitch: 0 },
        pitchOffset: 2,
      })
    ).toEqual({ note: "h", pitch: 1 });
  });
});
