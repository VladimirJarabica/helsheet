import { createContext, useContext } from "react";
import { Tuning } from "./types";
import { CFTuning } from "../data/tunings/cf";

type TuningContext = {
  tuning: Tuning;
};

const tuningContext = createContext<TuningContext>({
  tuning: CFTuning,
});

export const TuningContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <tuningContext.Provider value={{ tuning: CFTuning }}>
      {children}
    </tuningContext.Provider>
  );
};

export const useTuningContext = () => useContext(tuningContext);
