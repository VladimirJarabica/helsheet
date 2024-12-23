import { createContext, useContext } from "react";
import { Tuning } from "./types";
import { CFTuning } from "../data/tunings/cf";
import { Tuning as TuningType } from "@prisma/client";

const TUNINGS: Record<TuningType, Tuning> = {
  [TuningType.CF]: CFTuning,
  // TODO: create other tunings
  [TuningType.AD]: CFTuning,
  [TuningType.DG]: CFTuning,
};

type TuningContext = {
  tuning: Tuning;
};

const tuningContext = createContext<TuningContext>({
  tuning: CFTuning,
});

export const TuningContextProvider = ({
  tuning,
  children,
}: {
  tuning: TuningType;
  children: React.ReactNode;
}) => {
  return (
    <tuningContext.Provider value={{ tuning: TUNINGS[tuning] }}>
      {children}
    </tuningContext.Provider>
  );
};

export const useTuningContext = () => useContext(tuningContext);
