import { SongContent } from "../src/app/types";
import { dbClient } from "../src/services/db";

const run = async () => {
  const sheets = await dbClient.sheet.findMany({
    select: { id: true, content: true },
  });

  for await (const sheet of sheets) {
    const { id } = sheet;
    const content = sheet.content as SongContent;

    const newContent = {
      ...content,
      bars: content.bars.map((bar) => ({
        ...bar,
        columns: bar.columns.map((column) => ({
          ...column,
          bass: {
            ...column.bass,
            subCells: column.bass.subCells.map((subCell) => ({
              ...subCell,
              items: subCell.items.map((item) =>
                item.type === "bass"
                  ? {
                      ...item,
                      note: {
                        ...item.note,
                        note: item.note.note === "d" ? "dm" : item.note.note,
                      },
                    }
                  : item
              ),
            })),
          },
        })),
      })),
    };

    // @ts-ignore
    delete newContent.timeSignature;

    await dbClient.sheet.update({
      where: { id },
      data: { content: newContent },
    });
  }
};

run();
