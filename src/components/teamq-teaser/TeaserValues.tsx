"use client";

import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react";
import { BASELINE } from "./model";

export type Values = Record<string, number>;
type State = [Values, Dispatch<SetStateAction<Values>>];

const Ctx = createContext<State | null>(null);

/** The slider state, shared by the ask at the top of /teamq and the tool
 *  below it, so a lead posts the settings the visitor tried wherever the
 *  form sits on the page. */
export function TeaserValues({ children }: { children: React.ReactNode }) {
  const state = useState<Values>(BASELINE);
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

/** The shared state, or local state when there is no provider around. */
export function useTeaserValues(): State {
  const shared = useContext(Ctx);
  const local = useState<Values>(BASELINE);
  return shared ?? local;
}
