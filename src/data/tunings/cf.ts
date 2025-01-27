import { Tuning } from "../../app/types";

export const CFTuning: Tuning = {
  name: "CF",
  melodic: [
    {
      row: 1,
      buttons: [
        {
          button: 1,
          pull: { note: "gis", pitch: 1 },
          push: { note: "fis", pitch: 1 },
        },
        {
          button: 2,
          pull: { note: "g", pitch: 0 },
          push: { note: "e", pitch: 0 },
        },
        {
          button: 3,
          pull: { note: "h", pitch: 0 },
          push: { note: "g", pitch: 0 },
        },
        {
          button: 4,
          pull: { note: "d", pitch: 1 },
          push: { note: "c", pitch: 1 },
        },
        {
          button: 5,
          pull: { note: "f", pitch: 1 },
          push: { note: "e", pitch: 1 },
        },
        {
          button: 6,
          pull: { note: "a", pitch: 1 },
          push: { note: "g", pitch: 1 },
        },
        {
          button: 7,
          pull: { note: "h", pitch: 1 },
          push: { note: "c", pitch: 2 },
        },
        {
          button: 8,
          pull: { note: "d", pitch: 2 },
          push: { note: "e", pitch: 2 },
        },
        {
          button: 9,
          pull: { note: "f", pitch: 2 },
          push: { note: "g", pitch: 2 },
        },
        {
          button: 10,
          pull: { note: "a", pitch: 2 },
          push: { note: "c", pitch: 3 },
        },
        {
          button: 11,
          pull: { note: "h", pitch: 2 },
          push: { note: "e", pitch: 3 },
        },
      ],
    },
    {
      row: 2,
      buttons: [
        {
          button: 1,
          pull: { note: "cis", pitch: 2 },
          push: { note: "dis", pitch: 2 },
        },
        {
          button: 2,
          pull: { note: "c", pitch: 1 },
          push: { note: "a", pitch: 0 },
        },
        {
          button: 3,
          pull: { note: "e", pitch: 1 },
          push: { note: "c", pitch: 1 },
        },
        {
          button: 4,
          pull: { note: "g", pitch: 1 },
          push: { note: "f", pitch: 1 },
        },
        {
          button: 5,
          pull: { note: "b", pitch: 1 },
          push: { note: "a", pitch: 1 },
        },
        {
          button: 6,
          pull: { note: "c", pitch: 2 },
          push: { note: "c", pitch: 2 },
        },
        {
          button: 7,
          pull: { note: "e", pitch: 2 },
          push: { note: "f", pitch: 2 },
        },
        {
          button: 8,
          pull: { note: "g", pitch: 2 },
          push: { note: "a", pitch: 2 },
        },
        {
          button: 9,
          pull: { note: "b", pitch: 2 },
          push: { note: "c", pitch: 3 },
        },
        {
          button: 10,
          pull: { note: "d", pitch: 3 },
          push: { note: "f", pitch: 3 },
        },
      ],
    },
  ],
  bass: [
    {
      row: 1,
      buttons: [
        { button: 1, pull: { note: "C" }, push: { note: "F" } },
        { button: 2, pull: { note: "c" }, push: { note: "f" } },
        { button: 3, pull: { note: "G" }, push: { note: "C" } },
        { button: 4, pull: { note: "g" }, push: { note: "c" } },
      ],
    },
    {
      row: 2,
      buttons: [
        { button: 1, pull: { note: "B" }, push: { note: "B" } },
        { button: 2, pull: { note: "b" }, push: { note: "b" } },
        { button: 3, pull: { note: "D" }, push: { note: "A" } },
        {
          button: 4,
          pull: {
            note: "dm",
            shortcutKey: "d",
          },
          push: { note: "a" },
        },
      ],
    },
  ],
};
