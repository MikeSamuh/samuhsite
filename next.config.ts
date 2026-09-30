import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // draft-1 became /draft/a on 28 September; any link that went out still lands
    return [
      { source: "/draft-1", destination: "/draft/a", permanent: false },
      { source: "/draft-1/:path*", destination: "/draft/a/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
