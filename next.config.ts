import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // covers for YouTube embeds placed in the admin's editor, and images
    // uploaded there to Vercel Blob
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async redirects() {
    // draft-1 became /draft/a on 28 September; any link that went out still lands
    return [
      { source: "/draft-1", destination: "/draft/a", permanent: false },
      { source: "/draft-1/:path*", destination: "/draft/a/:path*", permanent: false },
      // Get Started became Explore TeamQ on 5 October. The route is kept for
      // the intake assessment, a later sprint
      { source: "/get-started", destination: "/teamq", permanent: false },
      // WordPress posts on samuh.work, mapped to the new Insights slugs on
      // 12 October. The 21 live posts all carry over. /insights/ itself keeps
      // its path. Live once the Insights route exists
      { source: "/episode-1-introduction-to-human-expansion", destination: "/insights/introduction", permanent: true },
      { source: "/episode-10-smartphones-harm-kids-what-can-parents-do", destination: "/insights/smartphones-harm-kids", permanent: true },
      { source: "/episode-11-a-short-history-of-performance-management", destination: "/insights/a-short-history-of-performance-management", permanent: true },
      { source: "/episode-12-six-universal-truths-of-great-performance", destination: "/insights/six-universal-truths-of-great-performance", permanent: true },
      { source: "/episode-13-how-to-pay-people-without-performance-ratings", destination: "/insights/how-to-pay-people-without-performance-ratings", permanent: true },
      { source: "/episode-14-principles-for-sustained-high-performance", destination: "/insights/four-principles-for-sustainable-high-performance", permanent: true },
      { source: "/episode-15-why-i-show-up-on-your-feed", destination: "/insights/why-i-show-up-on-your-feed", permanent: true },
      { source: "/episode-16-the-foundation-for-unstoppable-performance", destination: "/insights/the-foundation-for-unstoppable-performance", permanent: true },
      { source: "/episode-17-the-missing-link-for-healthy-habits", destination: "/insights/the-missing-link-for-healthy-habits", permanent: true },
      { source: "/episode-18-autonomy", destination: "/insights/autonomy", permanent: true },
      { source: "/episode-2-the-ugly-truth-about-smartphones", destination: "/insights/the-ugly-truth-about-smartphones", permanent: true },
      { source: "/episode-3-lets-redefine-success", destination: "/insights/lets-redefine-success", permanent: true },
      { source: "/episode-4-global-decline-in-wellbeing", destination: "/insights/global-decline-in-wellbeing", permanent: true },
      { source: "/episode-5-the-paradox-why-are-solutions-not-fixing-the-problem", destination: "/insights/the-paradox", permanent: true },
      { source: "/episode-6-insights-from-1-million-minds", destination: "/insights/insights-from-one-million-minds", permanent: true },
      { source: "/episode-7-wellbeing-more-than-happiness", destination: "/insights/wellbeing-more-than-happiness", permanent: true },
      { source: "/episode-8-lets-seek-inspiration-from-humanity-not-technology", destination: "/insights/seek-inspiration-from-humanity", permanent: true },
      { source: "/episode-9-the-social-self-and-why-it-matters", destination: "/insights/the-social-self", permanent: true },
      { source: "/have-you-heard-of-the-superchicken-experiment", destination: "/insights/the-superchicken-experiment", permanent: true },
      { source: "/team-performance-is-decided-in-the-moments-we-sometimes-miss", destination: "/insights/the-moments-we-sometimes-miss", permanent: true },
      { source: "/the-biggest-driver-for-performance-in-organizations", destination: "/insights/the-biggest-driver-of-performance", permanent: true },
    ];
  },
};

export default nextConfig;
