"use client";

import { useEffect, useState } from "react";
import { ACCENTS, BACKGROUNDS, TYPE_PAIRS, cssVars } from "@/lib/tokens";

// Applies the token set to the home shell. No direction is chosen yet, so the
// default is simply the first entry on each axis. The same deep link the
// configurator writes (#background.accent.type) is honoured here so the shell
// can be viewed under any combination the client is weighing.
//
// Once a direction is selected the tokens promote into globals.css and this
// wrapper goes away.
export default function HomeStage({ children }: { children: React.ReactNode }) {
  const [b, setB] = useState(0);
  const [a, setA] = useState(0);
  const [t, setT] = useState(0);

  useEffect(() => {
    const read = () => {
      const [bi, ai, ti] = window.location.hash.replace("#", "").split(".");
      const nb = BACKGROUNDS.findIndex((x) => x.id === bi);
      const na = ACCENTS.findIndex((x) => x.id === ai);
      const nt = TYPE_PAIRS.findIndex((x) => x.id === ti);
      if (nb >= 0) setB(nb);
      if (na >= 0) setA(na);
      if (nt >= 0) setT(nt);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const combo = { bg: BACKGROUNDS[b], accent: ACCENTS[a], type: TYPE_PAIRS[t] };

  return (
    <div className="home-stage" style={cssVars(combo)}>
      {children}
    </div>
  );
}
