"use client";

import Link from "next/link";
import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { ROUTES } from "@/lib/site";
import "./booking.css";

/** Jake's Google Calendar appointment schedule, inline on /contact. Google
 *  takes the booking and the confirmation; Clarify gets the event from its
 *  own Google sync. A visible placeholder until the schedule link is set.
 *  Moved here from /talk on 3 Nov 2026, when that page folded into
 *  /contact. */
export function Booking() {
  const url = process.env.NEXT_PUBLIC_BOOKING_URL;
  useEffect(() => {
    if (url) track("booking_open");
  }, [url]);
  if (!url) {
    return <div className="ph ph-tall booking-ph">TODO(content): the booking schedule. Set NEXT_PUBLIC_BOOKING_URL to Jake&rsquo;s intro call link.</div>;
  }
  return (
    <>
      <iframe className="booking-embed" src={url} title="Pick a time for an intro call" loading="lazy" />
      <p className="L-cap booking-after">
        Once a time is booked, Google sends the confirmation. Meanwhile, <Link href={ROUTES.insights} className="inline-link">read or watch something from Insights</Link>.
      </p>
    </>
  );
}
