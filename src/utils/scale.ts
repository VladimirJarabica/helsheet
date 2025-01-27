import { Scale as ScaleEnum } from "@prisma/client";
import { Note, ScaleSignature } from "../app/types";

export const formatScaleId = (scale: ScaleEnum) => scale.replace("_", " ");

export type Scale = {
  id: ScaleEnum;
  name: string;
  signature: ScaleSignature;
  notes: Note["note"][];
  transpositionNotes: Note[];
};
export const Scales: Scale[] = [
  {
    id: ScaleEnum.E_dur,
    name: "E dur",
    signature: "####",
    notes: ["cis", "dis", "e", "fis", "gis", "a", "h"],
    transpositionNotes: [
      { note: "e", pitch: 1 },
      { note: "fis", pitch: 1 },
      { note: "gis", pitch: 1 },
      { note: "a", pitch: 1 },
      { note: "h", pitch: 1 },
      { note: "cis", pitch: 2 },
      { note: "dis", pitch: 2 },
    ],
  },
  {
    id: ScaleEnum.A_dur,
    name: "A dur",
    signature: "###",
    notes: ["cis", "d", "e", "fis", "gis", "a", "h"],
    transpositionNotes: [
      { note: "a", pitch: 1 },
      { note: "h", pitch: 1 },
      { note: "cis", pitch: 2 },
      { note: "d", pitch: 2 },
      { note: "e", pitch: 2 },
      { note: "fis", pitch: 2 },
      { note: "gis", pitch: 2 },
    ],
  },
  {
    id: ScaleEnum.D_dur,
    name: "D dur",
    signature: "##",
    notes: ["cis", "d", "e", "fis", "g", "a", "h"],
    transpositionNotes: [
      { note: "d", pitch: 1 },
      { note: "e", pitch: 1 },
      { note: "fis", pitch: 1 },
      { note: "g", pitch: 1 },
      { note: "a", pitch: 1 },
      { note: "h", pitch: 1 },
      { note: "cis", pitch: 2 },
    ],
  },
  {
    id: ScaleEnum.G_dur,
    name: "G dur",
    signature: "#",
    notes: ["c", "d", "e", "fis", "g", "a", "h"],
    transpositionNotes: [
      { note: "g", pitch: 1 },
      { note: "a", pitch: 1 },
      { note: "h", pitch: 1 },
      { note: "c", pitch: 2 },
      { note: "d", pitch: 2 },
      { note: "e", pitch: 2 },
      { note: "fis", pitch: 2 },
    ],
  },
  {
    id: ScaleEnum.C_dur,
    name: "C dur",
    signature: "",
    notes: ["c", "d", "e", "f", "g", "a", "h"],
    transpositionNotes: [
      { note: "c", pitch: 1 },
      { note: "d", pitch: 1 },
      { note: "e", pitch: 1 },
      { note: "f", pitch: 1 },
      { note: "g", pitch: 1 },
      { note: "a", pitch: 1 },
      { note: "h", pitch: 1 },
    ],
  },
  {
    id: ScaleEnum.F_dur,
    name: "F dur",
    signature: "b",
    notes: ["c", "d", "e", "f", "g", "a", "b"],
    transpositionNotes: [
      { note: "f", pitch: 1 },
      { note: "g", pitch: 1 },
      { note: "a", pitch: 1 },
      { note: "b", pitch: 1 },
      { note: "c", pitch: 2 },
      { note: "d", pitch: 2 },
      { note: "e", pitch: 2 },
    ],
  },
  {
    id: ScaleEnum.B_dur,
    name: "B dur",
    signature: "bb",
    notes: ["c", "d", "es", "f", "g", "a", "b"],
    transpositionNotes: [
      { note: "b", pitch: 1 },
      { note: "c", pitch: 2 },
      { note: "d", pitch: 2 },
      { note: "es", pitch: 2 },
      { note: "f", pitch: 2 },
      { note: "g", pitch: 2 },
      { note: "a", pitch: 2 },
    ],
  },
  {
    id: ScaleEnum.Es_dur,
    name: "Es dur",
    signature: "bbb",
    notes: ["c", "d", "es", "f", "g", "as", "b"],
    transpositionNotes: [
      { note: "es", pitch: 1 },
      { note: "f", pitch: 1 },
      { note: "g", pitch: 1 },
      { note: "as", pitch: 1 },
      { note: "b", pitch: 1 },
      { note: "c", pitch: 2 },
      { note: "d", pitch: 2 },
    ],
  },
  {
    id: ScaleEnum.As_dur,
    name: "As dur",
    signature: "bbbb",
    notes: ["c", "des", "es", "f", "g", "as", "b"],
    transpositionNotes: [
      { note: "as", pitch: 1 },
      { note: "b", pitch: 1 },
      { note: "c", pitch: 2 },
      { note: "des", pitch: 2 },
      { note: "es", pitch: 2 },
      { note: "f", pitch: 2 },
      { note: "g", pitch: 2 },
    ],
  },
  {
    id: ScaleEnum.A_mol,
    name: "A mol",
    signature: "",
    notes: ["c", "d", "e", "f", "g", "a", "h"],
    transpositionNotes: [
      { note: "a", pitch: 0 },
      { note: "h", pitch: 0 },
      { note: "c", pitch: 1 },
      { note: "d", pitch: 1 },
      { note: "e", pitch: 1 },
      { note: "f", pitch: 1 },
      { note: "g", pitch: 1 },
    ],
  },
  {
    id: ScaleEnum.D_mol,
    name: "d mol",
    signature: "b",
    notes: ["c", "d", "e", "f", "g", "a", "b"],
    transpositionNotes: [
      { note: "d", pitch: 1 },
      { note: "e", pitch: 1 },
      { note: "f", pitch: 1 },
      { note: "g", pitch: 1 },
      { note: "a", pitch: 1 },
      { note: "b", pitch: 1 },
      { note: "c", pitch: 2 },
    ],
  },
];
