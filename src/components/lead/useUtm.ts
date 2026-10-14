"use client";

import { useEffect, useState } from "react";

export interface Utm {
  source?: string;
  medium?: string;
  campaign?: string;
}

const STORAGE_KEY = "samuh:utm";

function fromUrl(): Utm {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("utm_source") ?? undefined,
    medium: params.get("utm_medium") ?? undefined,
    campaign: params.get("utm_campaign") ?? undefined,
  };
}

function fromStorage(): Utm {
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/** Reads the UTM params on mount and keeps them for the session, so a visitor
 *  who lands on one page and submits on another still carries them. */
export function useUtm(): Utm {
  const [utm, setUtm] = useState<Utm>({});

  useEffect(() => {
    const landed = fromUrl();
    if (landed.source || landed.medium || landed.campaign) {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(landed));
      } catch {
        // storage is blocked. The params still ride along on this page
      }
      setUtm(landed);
      return;
    }
    setUtm(fromStorage());
  }, []);

  return utm;
}
