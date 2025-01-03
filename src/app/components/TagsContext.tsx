"use client";
import { Tag } from "@prisma/client";
import { createContext, useContext } from "react";

type TagsContext = {
  tags: Tag[];
};

const tagsContext = createContext<TagsContext>({
  tags: [],
});

export const TagsContextProvider = async ({
  children,
  tags,
}: {
  children: React.ReactNode;
  tags: Tag[];
}) => {
  return (
    <tagsContext.Provider value={{ tags }}>{children}</tagsContext.Provider>
  );
};

export const useTags = () => {
  return useContext(tagsContext).tags;
};
