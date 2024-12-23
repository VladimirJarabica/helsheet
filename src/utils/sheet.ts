import { Sheet } from "@prisma/client";

export const getSheetUrl = (
  sheet: Pick<Sheet, "id" | "name" | "editSecret">
) => {
  const name = sheet.name.toLowerCase().replace(/ /g, "-");
  return `/sheet/${sheet.id}_${name}?editSecret=${sheet.editSecret}`;
};

export const getSheetIdFromParam = (slug: string) => {
  const id = slug.split("_")[0];
  const parsed = parseInt(id, 10);
  return Number.isNaN(parsed) ? null : parsed;
};
