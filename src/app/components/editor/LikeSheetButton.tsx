"use client";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { dislikeSheet, likeSheet } from "./actions";
import { useEffect, useState } from "react";

interface LikeSheetButtonProps {
  sheetId: number;
  liked: boolean;
}
const LikeSheetButton = ({ sheetId, liked }: LikeSheetButtonProps) => {
  const [isLiked, setIsLiked] = useState(liked);

  useEffect(() => {
    setIsLiked(liked);
  }, [liked]);

  return (
    <button
      className="w-6"
      title={isLiked ? "Odobrať z obľúbených" : "Pridať do obľúbených"}
      onClick={(e) => {
        e.preventDefault();
        if (isLiked) {
          setIsLiked(false);
          dislikeSheet({ id: sheetId });
        } else {
          setIsLiked(true);
          likeSheet({ id: sheetId });
        }
      }}
    >
      {isLiked ? (
        <HeartIconSolid className="text-red-500" />
      ) : (
        <HeartIconOutline />
      )}
    </button>
  );
};

export default LikeSheetButton;
