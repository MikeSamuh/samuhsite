"use client";

import { useEffect, useState } from "react";
import { DEFAULT_COMBO, cssVars, parseComboHash, type Combo } from "@/lib/tokens";

// Applies the token set to the home shell. No direction is chosen yet, so the
// default is simply the first entry on each axis. The same deep link the
// configurator writes is honoured here so the shell can be viewed under any
// combination the client is weighing.
//
// Once a direction is selected the tokens promote into globals.css and this
// wrapper goes away.
export default function HomeStage({ children }: { children: React.ReactNode }) {
  const [combo, setCombo] = useState<Combo>(DEFAULT_COMBO);

  useEffect(() => {
    const read = () => setCombo(parseComboHash(window.location.hash));
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  return (
    <div className="home-stage" style={cssVars(combo)}>
      {children}
    </div>
  );
}
