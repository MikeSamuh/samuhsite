"use client";

import { useUtm } from "./useUtm";

/** Mounted once in the root layout so the UTM params are stored on whichever
 *  page the visitor lands on, not only on pages that carry a form. */
export function UtmCapture() {
  useUtm();
  return null;
}
