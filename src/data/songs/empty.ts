import { Song } from "../../app/types";

export const empty: Song = {
  timeSignature: "4/4",
  bars: [
    {
      beats: [
        {
          melodic: [
            {
              subCells: [{ items: [{ type: "empty" }] }],
              row: 1,
            },
            {
              subCells: [{ items: [{ type: "empty" }] }],
              row: 2,
            },
          ],
          bass: {
            subCells: [{ items: [{ type: "empty" }] }],
            row: "bass",
          },
          direction: "pull",
        },
        {
          melodic: [
            {
              subCells: [{ items: [{ type: "empty" }] }],
              row: 1,
            },
            {
              subCells: [{ items: [{ type: "empty" }] }],
              row: 2,
            },
          ],
          bass: {
            subCells: [{ items: [{ type: "empty" }] }],
            row: "bass",
          },
          direction: "empty",
        },
        {
          melodic: [
            {
              subCells: [{ items: [{ type: "empty" }] }],
              row: 1,
            },
            {
              subCells: [{ items: [{ type: "empty" }] }],
              row: 2,
            },
          ],
          bass: {
            subCells: [{ items: [{ type: "empty" }] }],
            row: "bass",
          },
          direction: "empty",
        },
        {
          melodic: [
            {
              subCells: [{ items: [{ type: "empty" }] }],
              row: 1,
            },
            {
              subCells: [{ items: [{ type: "empty" }] }],
              row: 2,
            },
          ],
          bass: {
            subCells: [{ items: [{ type: "bass", note: { note: "F" } }] }],
            row: "bass",
          },
          direction: "empty",
        },
      ],
      repeat: null,
    },
  ],
};
